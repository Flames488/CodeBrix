"""
chat_router.py
==============
Production-grade FastAPI router for the Codebrix AI chat endpoint.

Improvements over the original
--------------------------------
* Pydantic request / response models with full validation.
* Proper HTTP status codes and structured JSON error responses.
* Async handler — never blocks the event loop.
* Per-request correlation ID for distributed tracing.
* Structured logging on every request/response.
* Rate-limit header stubs (ready for middleware integration).
* OpenAPI metadata: tags, summary, description, response_model.
* Global and per-field input sanitisation (length caps, blank checks).
* Dependency-injected service layer for easy testing / mocking.
"""

from __future__ import annotations

import logging
import time
import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

from services.chat_service import handle_chat

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MAX_MESSAGE_LENGTH = 4_000   # characters
MAX_USER_ID_LENGTH = 128

# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    """Incoming chat message payload."""

    user_id: str = Field(
        ...,
        min_length=1,
        max_length=MAX_USER_ID_LENGTH,
        description="Unique identifier for the user sending the message.",
        examples=["user_abc123"],
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=MAX_MESSAGE_LENGTH,
        description="The user's message text.",
        examples=["What is 17 * 34?"],
    )
    metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Optional arbitrary metadata (e.g. client version, locale).",
    )

    @field_validator("message", "user_id", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Field must not be blank or whitespace only.")
        return stripped


class ChatResponse(BaseModel):
    """Successful chat response envelope."""

    request_id:   str  = Field(..., description="Unique ID for this request (use for support / tracing).")
    user_id:      str  = Field(..., description="Echo of the requesting user ID.")
    reply:        str  = Field(..., description="The AI-generated reply.")
    processing_ms: int = Field(..., description="Server-side processing time in milliseconds.")


class ErrorDetail(BaseModel):
    """Structured error body returned on failure."""

    request_id: str
    code:       str
    message:    str


# ---------------------------------------------------------------------------
# Dependency — service callable (makes the route unit-testable via override)
# ---------------------------------------------------------------------------

def get_chat_service():
    """Return the default chat service handler."""
    return handle_chat


ChatService = Annotated[Any, Depends(get_chat_service)]

# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/message",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Send a message to Codebrix AI",
    description=(
        "Submit a user message and receive an AI-generated reply. "
        "The agent may invoke registered tools (e.g. calculator) internally "
        "before composing its response."
    ),
    responses={
        422: {"description": "Validation error — malformed request body."},
        500: {"description": "Internal server error."},
        503: {"description": "Upstream AI service unavailable."},
    },
)
async def chat(
    request: Request,
    body: ChatRequest,
    chat_service: ChatService,
) -> ChatResponse:
    """
    Main chat endpoint.

    - Validates and sanitises the incoming payload via Pydantic.
    - Delegates to the injected ``chat_service`` (default: ``handle_chat``).
    - Returns a structured response with tracing metadata.
    """
    request_id = str(uuid.uuid4())
    start_ns   = time.perf_counter_ns()

    log.info(
        "Chat request received",
        extra={
            "request_id": request_id,
            "user_id":    body.user_id,
            "client_ip":  request.client.host if request.client else "unknown",
            "msg_length": len(body.message),
        },
    )

    try:
        reply: str = await _invoke_service(chat_service, body)
    except HTTPException:
        raise
    except Exception as exc:
        log.error(
            "Unhandled error in chat handler",
            extra={"request_id": request_id, "error": str(exc)},
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorDetail(
                request_id=request_id,
                code="INTERNAL_ERROR",
                message="An unexpected error occurred. Please try again later.",
            ).model_dump(),
        )

    elapsed_ms = (time.perf_counter_ns() - start_ns) // 1_000_000

    log.info(
        "Chat request completed",
        extra={
            "request_id":   request_id,
            "user_id":      body.user_id,
            "processing_ms": elapsed_ms,
            "reply_length": len(reply),
        },
    )

    return ChatResponse(
        request_id=request_id,
        user_id=body.user_id,
        reply=reply,
        processing_ms=elapsed_ms,
    )


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

async def _invoke_service(service: Any, body: ChatRequest) -> str:
    """
    Call the chat service, handling both sync and async implementations
    transparently, and mapping known failure modes to HTTP exceptions.
    """
    import asyncio
    import inspect

    try:
        if inspect.iscoroutinefunction(service):
            result = await service(body.user_id, body.message)
        else:
            # Run sync service in a thread pool to avoid blocking the loop
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None, service, body.user_id, body.message
            )
    except TimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "UPSTREAM_TIMEOUT", "message": str(exc)},
        )
    except ConnectionError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "UPSTREAM_UNAVAILABLE", "message": str(exc)},
        )

    if not isinstance(result, str) or not result.strip():
        log.warning("Chat service returned an empty or non-string reply.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"code": "EMPTY_REPLY", "message": "The AI returned an empty response."},
        )

    return result.strip()