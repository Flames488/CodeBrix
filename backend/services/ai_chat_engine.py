"""
app/agents/ai_chat_engine.py
-----------------------------
AI Chat Engine for the Codebrix AI Receptionist.

Responsibilities
----------------
- Accept a session-scoped user message.
- Retrieve full conversation history from ConversationMemory.
- Build a structured prompt and call the Anthropic Claude API.
- Persist both the user message and assistant reply to memory.
- Return a rich, typed response envelope.

Design notes
------------
- Module-level memory instance is intentional: the memory store is
  stateless from the engine's perspective (it delegates to a DB/cache),
  so sharing one instance across requests is safe and avoids re-init cost.
- The engine is async-first. If Claude's SDK is sync, the call is
  dispatched to a thread pool so it never blocks the event loop.
- All external I/O errors are caught and re-raised as ChatEngineError
  so callers get one predictable exception type to handle.
"""

from __future__ import annotations

import asyncio
import inspect
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

import anthropic

from core.config import settings
from core.logger import logger
from memory.conversation_memory import ConversationMemory

# ---------------------------------------------------------------------------
# Module-level singletons
# ---------------------------------------------------------------------------

memory = ConversationMemory()
_claude = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """
You are the Codebrix AI Receptionist — a professional, friendly, and highly 
knowledgeable assistant for Codebrix, an AI automation agency.

Your responsibilities:
- Greet prospects warmly and understand their business needs.
- Qualify leads by asking about their goals, timelines, and budget.
- Explain Codebrix services: AI-Powered Websites, Automation & Workflows, 
  AI Agents, SEO & Growth, Graphic Design, and Brand Identity.
- Guide interested prospects toward booking a free strategy call.
- Never make up pricing; direct specific pricing questions to the sales team.
- Keep responses concise (2–4 sentences) unless a detailed explanation is needed.
- Maintain a professional yet approachable tone at all times.
""".strip()

MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 1_024
MAX_HISTORY_TURNS = 20     # Keep last N messages to control token cost


# ---------------------------------------------------------------------------
# Custom exception
# ---------------------------------------------------------------------------

class ChatEngineError(Exception):
    """Raised when the chat engine cannot produce a reply."""


# ---------------------------------------------------------------------------
# Response model
# ---------------------------------------------------------------------------

@dataclass
class ChatEngineResponse:
    session_id: str
    reply: str
    model: str
    input_tokens: int
    output_tokens: int
    duration_ms: float
    timestamp: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "session_id": self.session_id,
            "reply": self.reply,
            "model": self.model,
            "usage": {
                "input_tokens": self.input_tokens,
                "output_tokens": self.output_tokens,
            },
            "duration_ms": round(self.duration_ms, 1),
            "timestamp": self.timestamp,
        }


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

class AIChatEngine:
    """
    Session-aware chat engine backed by Claude and ConversationMemory.

    Usage
    -----
        engine = AIChatEngine()
        response = await engine.reply("session-123", "I need AI automation help")
        print(response.reply)
    """

    async def reply(self, session_id: str, message: str) -> ChatEngineResponse:
        """
        Generate an AI reply for the given session and user message.

        Parameters
        ----------
        session_id : str
            Unique identifier for the conversation session.
        message : str
            The latest user message.

        Returns
        -------
        ChatEngineResponse
            Structured response containing the reply and metadata.

        Raises
        ------
        ChatEngineError
            On any failure to retrieve history, call Claude, or persist memory.
        """
        start = time.perf_counter()
        now = datetime.now(timezone.utc).isoformat()

        logger.info(
            "[ChatEngine] session=%s | message_len=%d",
            session_id, len(message),
        )

        # ── 1. Load conversation history ─────────────────────────────────
        try:
            raw_history: list[dict[str, str]] = memory.get_history(session_id)
        except Exception as exc:
            raise ChatEngineError(f"Failed to load history for session {session_id}") from exc

        # Trim to last N turns to stay within token budget
        trimmed = raw_history[-(MAX_HISTORY_TURNS * 2):]

        # ── 2. Build messages array ───────────────────────────────────────
        messages: list[dict[str, str]] = [
            *trimmed,
            {"role": "user", "content": message},
        ]

        # ── 3. Call Claude ────────────────────────────────────────────────
        try:
            claude_response = await _call_claude(messages)
        except Exception as exc:
            logger.exception("[ChatEngine] Claude call failed session=%s", session_id)
            raise ChatEngineError("AI service unavailable. Please try again shortly.") from exc

        reply_text: str = claude_response.content[0].text
        usage = claude_response.usage
        duration_ms = (time.perf_counter() - start) * 1000

        logger.info(
            "[ChatEngine] session=%s | tokens_in=%d | tokens_out=%d | %.1f ms",
            session_id,
            usage.input_tokens,
            usage.output_tokens,
            duration_ms,
        )

        # ── 4. Persist to memory ──────────────────────────────────────────
        try:
            memory.save_message(session_id, message, reply_text)
        except Exception as exc:
            # Non-fatal: log and continue — the reply is already generated.
            logger.warning(
                "[ChatEngine] Memory save failed session=%s: %s", session_id, exc
            )

        return ChatEngineResponse(
            session_id=session_id,
            reply=reply_text,
            model=claude_response.model,
            input_tokens=usage.input_tokens,
            output_tokens=usage.output_tokens,
            duration_ms=duration_ms,
            timestamp=now,
        )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _call_claude(messages: list[dict[str, str]]) -> Any:
    """
    Dispatch the Claude API call.
    Supports both sync and async SDK implementations transparently.
    """
    def _sync_call():
        return _claude.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            messages=messages,
        )

    if inspect.iscoroutinefunction(_claude.messages.create):
        return await _claude.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYSTEM_PROMPT,
            messages=messages,
        )

    # Run blocking sync SDK in thread pool
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, _sync_call)
