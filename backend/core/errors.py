"""
errors.py
=========
Production-grade FastAPI exception handling for Codebrix AI.

Features
--------
* Typed custom exceptions with HTTP status codes and machine-readable codes.
* Handlers for every meaningful FastAPI / Starlette / Pydantic error surface:
    - Custom app exceptions  (CodebrixException hierarchy)
    - HTTPException          (FastAPI's own)
    - RequestValidationError (Pydantic v2 request body / query failures)
    - ResponseValidationError (bug-catcher for malformed response models)
    - Unhandled Exception    (last-resort 500 with safe message sanitisation)
* Per-request correlation IDs surfaced in every error response.
* Structured logging on every error, with full tracebacks on 5xx.
* Safe message sanitisation — internal error details never leak to callers.
* One-call `register_error_handlers(app)` for clean app factory setup.
"""

from __future__ import annotations

import logging
import traceback
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError, ResponseValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Error envelope schema
# ---------------------------------------------------------------------------


class ErrorEnvelope(BaseModel):
    """Consistent JSON shape returned for every error in the API."""

    request_id: str
    code:       str
    message:    str
    details:    list[dict[str, Any]] = []
    timestamp:  datetime


def _envelope(
    request_id: str,
    code: str,
    message: str,
    details: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    return ErrorEnvelope(
        request_id=request_id,
        code=code,
        message=message,
        details=details or [],
        timestamp=datetime.now(timezone.utc),
    ).model_dump(mode="json")


def _request_id(request: Request) -> str:
    """Return an existing correlation ID from the request state, or mint a new one."""
    return getattr(request.state, "request_id", None) or str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Custom exception hierarchy
# ---------------------------------------------------------------------------


class CodebrixException(Exception):
    """
    Base class for all application-level exceptions.

    Raise a subclass (or this directly) anywhere in service/domain code;
    the handler below converts it to the right HTTP response automatically.
    """

    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    code:        str = "INTERNAL_ERROR"
    message:     str = "An unexpected error occurred."

    def __init__(
        self,
        message: str | None = None,
        *,
        details: list[dict[str, Any]] | None = None,
    ) -> None:
        self.message = message or self.__class__.message
        self.details = details or []
        super().__init__(self.message)


class BadRequestError(CodebrixException):
    status_code = status.HTTP_400_BAD_REQUEST
    code        = "BAD_REQUEST"
    message     = "The request is malformed or contains invalid data."


class AuthenticationError(CodebrixException):
    status_code = status.HTTP_401_UNAUTHORIZED
    code        = "UNAUTHORIZED"
    message     = "Authentication is required to access this resource."


class PermissionDeniedError(CodebrixException):
    status_code = status.HTTP_403_FORBIDDEN
    code        = "FORBIDDEN"
    message     = "You do not have permission to perform this action."


class NotFoundError(CodebrixException):
    status_code = status.HTTP_404_NOT_FOUND
    code        = "NOT_FOUND"
    message     = "The requested resource was not found."


class ConflictError(CodebrixException):
    status_code = status.HTTP_409_CONFLICT
    code        = "CONFLICT"
    message     = "The request conflicts with the current state of the resource."


class UnprocessableError(CodebrixException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    code        = "UNPROCESSABLE"
    message     = "The request is well-formed but contains semantic errors."


class RateLimitError(CodebrixException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    code        = "RATE_LIMITED"
    message     = "You have exceeded the allowed request rate. Please slow down."


class UpstreamError(CodebrixException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    code        = "UPSTREAM_UNAVAILABLE"
    message     = "A required upstream service is currently unavailable."


class AIServiceError(UpstreamError):
    code    = "AI_SERVICE_ERROR"
    message = "The AI service returned an unexpected response."


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------


async def _handle_codebrix_exception(
    request: Request, exc: CodebrixException
) -> JSONResponse:
    rid = _request_id(request)

    # Only log 5xx as ERROR; 4xx are client mistakes → WARNING
    if exc.status_code >= 500:
        log.error(
            "Application error [%s] %s",
            exc.code, exc.message,
            extra={"request_id": rid, "path": request.url.path},
            exc_info=True,
        )
    else:
        log.warning(
            "Client error [%s] %s",
            exc.code, exc.message,
            extra={"request_id": rid, "path": request.url.path},
        )

    return JSONResponse(
        status_code=exc.status_code,
        content=_envelope(rid, exc.code, exc.message, exc.details),
    )


async def _handle_http_exception(
    request: Request, exc: HTTPException
) -> JSONResponse:
    rid = _request_id(request)

    # Normalise FastAPI HTTPException detail to our envelope format
    raw_detail = exc.detail
    if isinstance(raw_detail, dict):
        code    = str(raw_detail.get("code",    "HTTP_ERROR"))
        message = str(raw_detail.get("message", "An HTTP error occurred."))
    else:
        code    = f"HTTP_{exc.status_code}"
        message = str(raw_detail) if raw_detail else "An HTTP error occurred."

    log.warning(
        "HTTP %d — %s",
        exc.status_code, message,
        extra={"request_id": rid, "path": request.url.path},
    )

    response = JSONResponse(
        status_code=exc.status_code,
        content=_envelope(rid, code, message),
    )

    # Preserve headers set by FastAPI (e.g. WWW-Authenticate on 401)
    if exc.headers:
        response.headers.update(exc.headers)

    return response


async def _handle_validation_error(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    rid = _request_id(request)

    details = [
        {
            "field":   " → ".join(str(loc) for loc in err.get("loc", [])),
            "message": err.get("msg", ""),
            "type":    err.get("type", ""),
        }
        for err in exc.errors()
    ]

    log.warning(
        "Request validation failed (%d field error(s))",
        len(details),
        extra={"request_id": rid, "path": request.url.path},
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=_envelope(
            rid,
            "VALIDATION_ERROR",
            f"Request validation failed with {len(details)} error(s).",
            details,
        ),
    )


async def _handle_response_validation_error(
    request: Request, exc: ResponseValidationError
) -> JSONResponse:
    """
    Fires when a *response* model fails validation — always a server bug.
    Log the full detail internally but return a sanitised 500 to the caller.
    """
    rid = _request_id(request)
    log.error(
        "Response serialisation error (server bug) — %d issue(s):\n%s",
        len(exc.errors()),
        "\n".join(str(e) for e in exc.errors()),
        extra={"request_id": rid, "path": request.url.path},
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=_envelope(
            rid,
            "RESPONSE_ERROR",
            "The server produced a malformed response. Our team has been alerted.",
        ),
    )


async def _handle_unhandled_exception(
    request: Request, exc: Exception
) -> JSONResponse:
    """
    Last-resort handler.  Logs the full traceback but returns only a safe,
    generic message to the caller — never leaks implementation details.
    """
    rid = _request_id(request)
    log.error(
        "Unhandled exception on %s %s\n%s",
        request.method,
        request.url.path,
        traceback.format_exc(),
        extra={"request_id": rid},
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=_envelope(
            rid,
            "INTERNAL_ERROR",
            "An unexpected error occurred. Please try again later.",
        ),
    )


# ---------------------------------------------------------------------------
# Registration helper
# ---------------------------------------------------------------------------


def register_error_handlers(app: FastAPI) -> None:
    """
    Attach all exception handlers to a FastAPI application instance.

    Call this once inside your app factory, e.g.::

        from errors import register_error_handlers

        app = FastAPI()
        register_error_handlers(app)

    Order matters — more specific types must be registered before broader ones.
    """
    app.add_exception_handler(CodebrixException,        _handle_codebrix_exception)   # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError,   _handle_validation_error)     # type: ignore[arg-type]
    app.add_exception_handler(ResponseValidationError,  _handle_response_validation_error)  # type: ignore[arg-type]
    app.add_exception_handler(HTTPException,            _handle_http_exception)       # type: ignore[arg-type]
    app.add_exception_handler(Exception,                _handle_unhandled_exception)  # type: ignore[arg-type]

    log.info("Error handlers registered on %s", app.title or "FastAPI app")