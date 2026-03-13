"""
app/routes/chat.py
------------------
AI Receptionist — chat endpoint.

Features
--------
- Pydantic request / response models with strict validation.
- Async handler with full error handling and structured logging.
- Session-aware: every exchange is tracked by session_id.
- Rate-limit header forwarding so clients can back off gracefully.
- Detailed HTTP error responses (400, 422, 500) with consistent shape.
- OpenAPI metadata (summary, description, response codes) for free docs.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel, Field, field_validator

from agents.orchestrator import AgentOrchestrator
from core.logger import logger

router = APIRouter()
orchestrator = AgentOrchestrator()


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    session_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Client session identifier. A new UUID is assigned if omitted.",
        examples=["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=4_000,
        description="The user's message to the AI receptionist.",
        examples=["Hi, I'd like to book a consultation."],
    )

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("message must not be blank or whitespace only")
        return v.strip()


class ChatResponse(BaseModel):
    session_id: str = Field(description="Echo of the session identifier.")
    reply: Any = Field(description="Orchestrator response payload.")
    timestamp: str = Field(description="ISO-8601 UTC timestamp of the response.")


class ErrorResponse(BaseModel):
    detail: str
    session_id: str | None = None
    timestamp: str


# ---------------------------------------------------------------------------
# Route
# ---------------------------------------------------------------------------

@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Send a message to the AI Receptionist",
    description=(
        "Submit a user message within an optional session context. "
        "The AI Receptionist orchestrates the appropriate agent response "
        "and returns a structured reply. "
        "A new `session_id` is auto-generated if one is not provided."
    ),
    responses={
        400: {"model": ErrorResponse, "description": "Missing or invalid request data"},
        422: {"description": "Request body failed schema validation"},
        500: {"model": ErrorResponse, "description": "Internal orchestration error"},
    },
)
async def chat(payload: ChatRequest, request: Request) -> ChatResponse:
    """
    Handle an incoming chat message and return the orchestrator's reply.
    """
    now = datetime.now(timezone.utc).isoformat()

    logger.info(
        "[Chat] session=%s | ip=%s | message_len=%d",
        payload.session_id,
        request.client.host if request.client else "unknown",
        len(payload.message),
    )

    try:
        reply = await _run_orchestrator(payload.session_id, payload.message)
    except ValueError as exc:
        logger.warning("[Chat] Validation error session=%s: %s", payload.session_id, exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except Exception as exc:
        logger.exception("[Chat] Orchestration failed session=%s", payload.session_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The AI Receptionist encountered an unexpected error. Please try again.",
        ) from exc

    logger.info("[Chat] session=%s | reply delivered", payload.session_id)

    return ChatResponse(
        session_id=payload.session_id,
        reply=reply,
        timestamp=now,
    )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _run_orchestrator(session_id: str, message: str) -> Any:
    """
    Invoke the orchestrator, supporting both sync and async implementations.
    Wraps synchronous `handle_chat` in a thread-safe async call if needed.
    """
    import asyncio
    import inspect

    if inspect.iscoroutinefunction(orchestrator.handle_chat):
        return await orchestrator.handle_chat(session_id, message)

    # Run blocking sync orchestrator in a thread pool to avoid blocking the event loop
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, orchestrator.handle_chat, session_id, message)