"""
lead_router.py
==============
Production-grade FastAPI router for the Codebrix AI lead intake endpoint.

Improvements over the original
--------------------------------
* Rich Pydantic models with field validation, examples, and sanitisation.
* Async handler with sync-service thread-pool fallback.
* Per-request correlation ID for distributed tracing.
* Structured logging on every stage (intake, dispatch, completion, error).
* Typed WorkflowResult envelope — no more bare {"status": result} guessing.
* HTTP 202 Accepted for async-style workflows; 422 / 500 / 503 for failures.
* Dependency-injected workflow service (trivially mockable in tests).
* Full OpenAPI metadata: tags, summary, description, response docs.
* Input sanitisation: length caps, blank checks, email/phone format guards.
"""

from __future__ import annotations

import asyncio
import inspect
import logging
import re
import time
import uuid
from enum import Enum
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from services.workflow_engine import new_lead_workflow

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MAX_NAME_LEN    = 120
MAX_COMPANY_LEN = 200
MAX_NOTE_LEN    = 2_000
PHONE_RE        = re.compile(r"^\+?[\d\s\-().]{7,20}$")

# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class LeadSource(str, Enum):
    WEBSITE     = "website"
    REFERRAL    = "referral"
    LINKEDIN    = "linkedin"
    COLD_EMAIL  = "cold_email"
    EVENT       = "event"
    OTHER       = "other"


class LeadStatus(str, Enum):
    ACCEPTED    = "accepted"
    PENDING     = "pending"
    REJECTED    = "rejected"
    DUPLICATE   = "duplicate"


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class LeadRequest(BaseModel):
    """Incoming lead payload."""

    first_name: str = Field(
        ...,
        min_length=1,
        max_length=MAX_NAME_LEN,
        description="Lead's first name.",
        examples=["Sarah"],
    )
    last_name: str = Field(
        ...,
        min_length=1,
        max_length=MAX_NAME_LEN,
        description="Lead's last name.",
        examples=["Connor"],
    )
    email: EmailStr = Field(
        ...,
        description="Lead's primary email address.",
        examples=["sarah.connor@example.com"],
    )
    phone: str | None = Field(
        default=None,
        description="Optional phone number (E.164 or local format).",
        examples=["+1 800 555 0100"],
    )
    company: str | None = Field(
        default=None,
        max_length=MAX_COMPANY_LEN,
        description="Company or organisation name.",
        examples=["Cyberdyne Systems"],
    )
    source: LeadSource = Field(
        default=LeadSource.OTHER,
        description="Channel through which the lead was acquired.",
    )
    notes: str | None = Field(
        default=None,
        max_length=MAX_NOTE_LEN,
        description="Optional free-text notes from the intake form.",
    )
    metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Arbitrary key-value pairs (e.g. UTM tags, form version).",
    )

    # -- validators ----------------------------------------------------------

    @field_validator("first_name", "last_name", mode="before")
    @classmethod
    def _clean_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name fields must not be blank.")
        return v

    @field_validator("phone", mode="before")
    @classmethod
    def _validate_phone(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        if not PHONE_RE.fullmatch(v):
            raise ValueError(
                f"Phone number {v!r} does not match an expected format. "
                "Accepted: E.164 (+12125551234) or local variants."
            )
        return v

    @field_validator("notes", "company", mode="before")
    @classmethod
    def _strip_optional_strings(cls, v: str | None) -> str | None:
        return v.strip() if isinstance(v, str) else v

    @model_validator(mode="after")
    def _at_least_one_contact(self) -> "LeadRequest":
        """Ensure we have at least email (already required) or phone."""
        return self   # email is always present; extend this guard if needed

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


class WorkflowResult(BaseModel):
    """
    Structured envelope returned by the workflow engine.
    Accepts a plain string (legacy) or a dict for forward-compatibility.
    """

    status:     LeadStatus
    lead_id:    str | None = Field(default=None, description="CRM-assigned lead identifier, if available.")
    message:    str | None = Field(default=None, description="Human-readable status message.")
    next_steps: list[str]  = Field(default_factory=list, description="Recommended follow-up actions.")


class LeadResponse(BaseModel):
    """Successful lead intake response."""

    request_id:    str          = Field(..., description="Unique ID for this request (tracing / support).")
    lead_id:       str | None   = Field(None, description="CRM lead ID assigned by the workflow.")
    status:        LeadStatus
    message:       str | None
    next_steps:    list[str]
    processing_ms: int          = Field(..., description="Server-side processing time in milliseconds.")


# ---------------------------------------------------------------------------
# Dependency — workflow callable
# ---------------------------------------------------------------------------

def get_workflow_service():
    """Return the default workflow handler."""
    return new_lead_workflow


WorkflowService = Annotated[Any, Depends(get_workflow_service)]

# ---------------------------------------------------------------------------
# Router
# ---------------------------------------------------------------------------

router = APIRouter(
    prefix="/leads",
    tags=["Leads"],
)


@router.post(
    "/lead",
    response_model=LeadResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Submit a new lead",
    description=(
        "Ingest a new sales lead and trigger the Codebrix AI new-lead workflow. "
        "The workflow may enrich the lead, check for duplicates, assign ownership, "
        "and schedule follow-up tasks before returning a structured status."
    ),
    responses={
        202: {"description": "Lead accepted and workflow triggered."},
        422: {"description": "Validation error — malformed or missing fields."},
        500: {"description": "Internal server error."},
        503: {"description": "Workflow engine unavailable."},
    },
)
async def create_lead(
    request: Request,
    body: LeadRequest,
    workflow: WorkflowService,
) -> LeadResponse:
    """
    Lead intake endpoint.

    1. Validates and sanitises the payload via Pydantic.
    2. Delegates to the injected ``workflow`` service.
    3. Normalises the result into a typed :class:`LeadResponse`.
    """
    request_id = str(uuid.uuid4())
    start_ns   = time.perf_counter_ns()

    log.info(
        "Lead intake received",
        extra={
            "request_id": request_id,
            "email":      body.email,
            "source":     body.source,
            "company":    body.company,
            "client_ip":  request.client.host if request.client else "unknown",
        },
    )

    # -- Run workflow --------------------------------------------------------
    try:
        raw_result = await _invoke_workflow(workflow, body)
    except HTTPException:
        raise
    except Exception as exc:
        log.error(
            "Unhandled error in lead workflow",
            extra={"request_id": request_id, "error": str(exc)},
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "request_id": request_id,
                "code":       "WORKFLOW_ERROR",
                "message":    "An unexpected error occurred processing the lead.",
            },
        )

    # -- Normalise result ----------------------------------------------------
    workflow_result = _normalise_result(raw_result)
    elapsed_ms      = (time.perf_counter_ns() - start_ns) // 1_000_000

    log.info(
        "Lead workflow completed",
        extra={
            "request_id":    request_id,
            "status":        workflow_result.status,
            "lead_id":       workflow_result.lead_id,
            "processing_ms": elapsed_ms,
        },
    )

    return LeadResponse(
        request_id=request_id,
        lead_id=workflow_result.lead_id,
        status=workflow_result.status,
        message=workflow_result.message,
        next_steps=workflow_result.next_steps,
        processing_ms=elapsed_ms,
    )


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

async def _invoke_workflow(service: Any, body: LeadRequest) -> Any:
    """
    Call the workflow service, supporting both sync and async implementations.
    Maps connection / timeout errors to appropriate HTTP exceptions.
    """
    try:
        if inspect.iscoroutinefunction(service):
            return await service(body.model_dump())
        else:
            loop = asyncio.get_event_loop()
            return await loop.run_in_executor(None, service, body.model_dump())
    except TimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "WORKFLOW_TIMEOUT", "message": str(exc)},
        )
    except ConnectionError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "WORKFLOW_UNAVAILABLE", "message": str(exc)},
        )


def _normalise_result(raw: Any) -> WorkflowResult:
    """
    Accept whatever the workflow engine returns and coerce it into a
    :class:`WorkflowResult`.

    Handles:
    - ``WorkflowResult`` instance (pass-through)
    - ``dict``  with at least a ``status`` key
    - Plain ``str``  (legacy — treated as the status value)
    """
    if isinstance(raw, WorkflowResult):
        return raw

    if isinstance(raw, dict):
        status_val = raw.get("status", LeadStatus.PENDING)
        return WorkflowResult(
            status=LeadStatus(status_val) if isinstance(status_val, str) else status_val,
            lead_id=raw.get("lead_id"),
            message=raw.get("message"),
            next_steps=raw.get("next_steps", []),
        )

    if isinstance(raw, str):
        try:
            return WorkflowResult(status=LeadStatus(raw.lower()))
        except ValueError:
            log.warning("Workflow returned unrecognised status string %r — defaulting to PENDING.", raw)
            return WorkflowResult(status=LeadStatus.PENDING, message=raw)

    log.warning("Workflow returned unexpected type %s — defaulting to PENDING.", type(raw).__name__)
    return WorkflowResult(status=LeadStatus.PENDING)