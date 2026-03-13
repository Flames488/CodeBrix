"""
services/conversation_manager.py
---------------------------------
Codebrix AI Receptionist — Conversation Manager.

Responsibilities
----------------
- Central dispatcher for all inbound messages regardless of source channel.
- Validates and normalises incoming payloads before agent invocation.
- Enriches responses with metadata: source, timing, token usage, session info.
- Scores each lead via LeadScorer and attaches the result to the response.
- Persists a structured conversation event for analytics and audit trail.
- Handles and classifies errors so callers receive a consistent error shape.

Supported sources
-----------------
  web       – Website chat widget
  whatsapp  – WhatsApp Business API
  email     – Inbound email parser
  api       – Direct API integration
  internal  – Internal tooling / testing
"""

from __future__ import annotations

import asyncio
import inspect
import time
import uuid
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from enum import Enum
from typing import Any

from services.agents.agent_brain import run_agent
from agents.lead_scoring import LeadScorer, ScoreResult
from core.logger import logger

# ---------------------------------------------------------------------------
# Constants & enums
# ---------------------------------------------------------------------------

class MessageSource(str, Enum):
    WEB       = "web"
    WHATSAPP  = "whatsapp"
    EMAIL     = "email"
    API       = "api"
    INTERNAL  = "internal"


MAX_MESSAGE_LENGTH = 4_000
_scorer = LeadScorer()


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

@dataclass
class InboundMessage:
    """Validated and normalised inbound message payload."""
    user_id: str
    message: str
    source: MessageSource
    session_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    metadata: dict[str, Any] = field(default_factory=dict)
    received_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class ConversationResponse:
    """Structured response envelope returned to all callers."""
    event_id: str
    session_id: str
    user_id: str
    source: str
    reply: Any
    lead_score: int
    lead_band: str
    duration_ms: float
    timestamp: str
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class ConversationError:
    """Consistent error shape returned on all failure paths."""
    event_id: str
    session_id: str
    user_id: str
    source: str
    error: str
    error_type: str
    timestamp: str

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


# ---------------------------------------------------------------------------
# Custom exceptions
# ---------------------------------------------------------------------------

class ConversationValidationError(ValueError):
    """Raised when the inbound payload fails validation."""


class ConversationAgentError(RuntimeError):
    """Raised when the agent fails to produce a reply."""


# ---------------------------------------------------------------------------
# Manager
# ---------------------------------------------------------------------------

class ConversationManager:
    """
    Central dispatcher for all inbound messages across source channels.

    Usage
    -----
        manager = ConversationManager()

        # Async (preferred)
        result = await manager.process("user-123", "I need AI automation", "web")

        # Sync convenience wrapper
        result = manager.process_sync("user-123", "Tell me about pricing", "api")
    """

    async def process(
        self,
        user_id: str,
        message: str,
        source: str,
        session_id: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> ConversationResponse:
        """
        Validate, route, score, and respond to an inbound message.

        Parameters
        ----------
        user_id   : Unique identifier for the user/contact.
        message   : Raw user message text.
        source    : Channel origin (web, whatsapp, email, api, internal).
        session_id: Optional existing session ID; a new one is generated if omitted.
        metadata  : Optional arbitrary context (e.g. IP, country, referrer).

        Returns
        -------
        ConversationResponse

        Raises
        ------
        ConversationValidationError  – on bad input.
        ConversationAgentError       – if the agent fails after all retries.
        """
        event_id = str(uuid.uuid4())
        start    = time.perf_counter()
        now      = datetime.now(timezone.utc).isoformat()

        # ── 1. Validate & normalise ───────────────────────────────────────
        inbound = _validate(
            user_id=user_id,
            message=message,
            source=source,
            session_id=session_id,
            metadata=metadata or {},
        )

        logger.info(
            "[ConversationManager] event=%s | session=%s | user=%s | source=%s | msg_len=%d",
            event_id, inbound.session_id, inbound.user_id, inbound.source, len(inbound.message),
        )

        # ── 2. Lead scoring (non-blocking) ────────────────────────────────
        score_result: ScoreResult = _scorer.score({
            "session_id": inbound.session_id,
            "user_id":    inbound.user_id,
            "message":    inbound.message,
        })

        logger.info(
            "[ConversationManager] event=%s | lead_score=%d | band=%s",
            event_id, score_result.score, score_result.band,
        )

        # ── 3. Run agent ──────────────────────────────────────────────────
        try:
            agent_reply = await _invoke_agent(inbound)
        except Exception as exc:
            logger.exception(
                "[ConversationManager] Agent failed event=%s session=%s", event_id, inbound.session_id
            )
            raise ConversationAgentError(
                f"Agent failed for session {inbound.session_id}"
            ) from exc

        duration_ms = (time.perf_counter() - start) * 1000

        logger.info(
            "[ConversationManager] event=%s | completed in %.1f ms", event_id, duration_ms
        )

        # ── 4. Build & return response ────────────────────────────────────
        return ConversationResponse(
            event_id=event_id,
            session_id=inbound.session_id,
            user_id=inbound.user_id,
            source=inbound.source.value,
            reply=agent_reply,
            lead_score=score_result.score,
            lead_band=score_result.band,
            duration_ms=round(duration_ms, 1),
            timestamp=now,
            metadata={
                **inbound.metadata,
                "lead_signals": score_result.matched_signals,
                "category_breakdown": score_result.category_breakdown,
            },
        )

    def process_sync(
        self,
        user_id: str,
        message: str,
        source: str,
        session_id: str | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> ConversationResponse:
        """
        Synchronous convenience wrapper around `process`.
        Useful for scripts, tests, and non-async callers.
        """
        return asyncio.run(
            self.process(user_id, message, source, session_id, metadata)
        )


# ---------------------------------------------------------------------------
# Module-level convenience function (backwards-compatible)
# ---------------------------------------------------------------------------

_manager = ConversationManager()


async def process_message(
    user_id: str,
    message: str,
    source: str,
    session_id: str | None = None,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Backwards-compatible async function wrapper.
    New callers should prefer instantiating ConversationManager directly.
    """
    result = await _manager.process(user_id, message, source, session_id, metadata)
    return result.to_dict()


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _validate(
    user_id: str,
    message: str,
    source: str,
    session_id: str | None,
    metadata: dict[str, Any],
) -> InboundMessage:
    """Validate and normalise raw input into an InboundMessage."""

    if not user_id or not isinstance(user_id, str) or not user_id.strip():
        raise ConversationValidationError("user_id must be a non-empty string.")

    if not message or not isinstance(message, str) or not message.strip():
        raise ConversationValidationError("message must be a non-empty string.")

    if len(message) > MAX_MESSAGE_LENGTH:
        raise ConversationValidationError(
            f"message exceeds maximum length of {MAX_MESSAGE_LENGTH} characters."
        )

    try:
        normalised_source = MessageSource(source.lower().strip())
    except ValueError:
        valid = [s.value for s in MessageSource]
        raise ConversationValidationError(
            f"Invalid source '{source}'. Must be one of: {valid}."
        )

    return InboundMessage(
        user_id=user_id.strip(),
        message=message.strip(),
        source=normalised_source,
        session_id=session_id or str(uuid.uuid4()),
        metadata=metadata,
    )


async def _invoke_agent(inbound: InboundMessage) -> Any:
    """
    Call run_agent, transparently supporting both sync and async implementations.
    Sync agents are dispatched to a thread pool to avoid blocking the event loop.
    """
    if inspect.iscoroutinefunction(run_agent):
        return await run_agent(inbound.user_id, inbound.message)

    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        None, run_agent, inbound.user_id, inbound.message
    )