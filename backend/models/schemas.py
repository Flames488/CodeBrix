"""
schemas.py
==========
Production-grade Pydantic v2 request / response schemas for the Codebrix AI API.

Covers
------
* PromptRequest      — single-turn prompt submission
* ConversationRequest — multi-turn chat with history
* PromptResponse     — structured AI reply envelope
* StreamChunk        — SSE token chunk for streaming endpoints
* ErrorResponse      — consistent error envelope used across all routes
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import uuid4

from pydantic import (
    BaseModel,
    Field,
    field_validator,
    model_validator,
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MAX_PROMPT_LENGTH       = 32_000   # ~8k tokens at ~4 chars/token
MAX_SYSTEM_PROMPT_LENGTH = 4_000
MAX_HISTORY_TURNS       = 50
MAX_USER_ID_LENGTH      = 128
MAX_SESSION_ID_LENGTH   = 128


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class Role(str, Enum):
    system    = "system"
    user      = "user"
    assistant = "assistant"


class ResponseFormat(str, Enum):
    text     = "text"
    markdown = "markdown"
    json     = "json"


# ---------------------------------------------------------------------------
# Shared sub-models
# ---------------------------------------------------------------------------

class Message(BaseModel):
    """A single turn in a conversation."""

    role:    Role = Field(..., description="Who authored this message.")
    content: str  = Field(
        ...,
        min_length=1,
        max_length=MAX_PROMPT_LENGTH,
        description="Text content of the message.",
    )

    @field_validator("content", mode="before")
    @classmethod
    def strip_content(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Message content must not be blank.")
        return stripped


class GenerationConfig(BaseModel):
    """Optional fine-grained controls forwarded to the model."""

    temperature:  float = Field(default=0.7,  ge=0.0, le=2.0,   description="Sampling temperature.")
    max_tokens:   int   = Field(default=1024, ge=1,   le=16_384, description="Maximum tokens to generate.")
    top_p:        float = Field(default=1.0,  ge=0.0, le=1.0,   description="Nucleus sampling probability.")
    stream:       bool  = Field(default=False,                   description="Enable SSE token streaming.")
    response_format: ResponseFormat = Field(
        default=ResponseFormat.text,
        description="Desired output format hint passed to the model.",
    )


# ---------------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------------

class PromptRequest(BaseModel):
    """
    Single-turn prompt submission.

    Minimal surface area — the caller provides a prompt and, optionally,
    contextual metadata and generation knobs.
    """

    prompt: str = Field(
        ...,
        min_length=1,
        max_length=MAX_PROMPT_LENGTH,
        description="The user's input prompt.",
        examples=["Explain how transformers work in simple terms."],
    )
    user_id: str | None = Field(
        default=None,
        max_length=MAX_USER_ID_LENGTH,
        description="Optional user identifier for memory / personalisation.",
        examples=["user_abc123"],
    )
    session_id: str | None = Field(
        default=None,
        max_length=MAX_SESSION_ID_LENGTH,
        description="Optional session ID for grouping related requests.",
    )
    system_prompt: str | None = Field(
        default=None,
        max_length=MAX_SYSTEM_PROMPT_LENGTH,
        description="Optional system-level instruction to override the default.",
    )
    config: GenerationConfig = Field(
        default_factory=GenerationConfig,
        description="Optional generation parameters.",
    )
    metadata: dict[str, Any] = Field(
        default_factory=dict,
        description="Arbitrary client-supplied metadata (locale, app version, etc.).",
    )

    @field_validator("prompt", "user_id", "session_id", "system_prompt", mode="before")
    @classmethod
    def strip_strings(cls, v: str | None) -> str | None:
        if v is None:
            return v
        stripped = v.strip()
        return stripped if stripped else None


class ConversationRequest(BaseModel):
    """
    Multi-turn chat request carrying the full message history.

    The caller is responsible for maintaining and sending history;
    the server stays stateless from the transport layer's perspective.
    """

    messages: list[Message] = Field(
        ...,
        min_length=1,
        description="Ordered conversation history. Last entry must be a user message.",
    )
    user_id: str | None = Field(default=None, max_length=MAX_USER_ID_LENGTH)
    session_id: str | None = Field(default=None, max_length=MAX_SESSION_ID_LENGTH)
    config: GenerationConfig = Field(default_factory=GenerationConfig)
    metadata: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def last_message_must_be_user(self) -> ConversationRequest:
        if self.messages and self.messages[-1].role != Role.user:
            raise ValueError("The last message in the conversation must have role 'user'.")
        return self

    @model_validator(mode="after")
    def cap_history_length(self) -> ConversationRequest:
        if len(self.messages) > MAX_HISTORY_TURNS:
            raise ValueError(
                f"Conversation history must not exceed {MAX_HISTORY_TURNS} turns. "
                f"Received {len(self.messages)}."
            )
        return self


# ---------------------------------------------------------------------------
# Response schemas
# ---------------------------------------------------------------------------

class UsageStats(BaseModel):
    """Token consumption reported by the model provider."""

    prompt_tokens:     int = Field(..., ge=0)
    completion_tokens: int = Field(..., ge=0)
    total_tokens:      int = Field(..., ge=0)


class PromptResponse(BaseModel):
    """
    Successful AI response envelope.

    Every field is documented so the OpenAPI spec is self-explanatory
    without needing external docs.
    """

    request_id:    str           = Field(
        default_factory=lambda: str(uuid4()),
        description="Unique ID for this request — include in bug reports.",
    )
    reply:         str           = Field(..., description="The AI-generated reply text.")
    model:         str           = Field(..., description="Model identifier that produced the reply.")
    usage:         UsageStats | None = Field(
        default=None,
        description="Token usage for billing / monitoring (None when streaming).",
    )
    processing_ms: int           = Field(..., ge=0, description="Server-side latency in milliseconds.")
    created_at:    datetime      = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC timestamp of when the response was generated.",
    )
    metadata:      dict[str, Any] = Field(
        default_factory=dict,
        description="Any extra metadata the server chooses to surface.",
    )


class StreamChunk(BaseModel):
    """
    A single SSE token chunk emitted during streaming.

    Clients accumulate ``delta`` values to build the full reply;
    ``finished`` signals the end of the stream.
    """

    request_id: str  = Field(..., description="Links this chunk to its originating request.")
    delta:      str  = Field(..., description="Incremental token text.")
    finished:   bool = Field(default=False, description="True on the final (empty-delta) chunk.")
    usage:      UsageStats | None = Field(
        default=None,
        description="Populated only on the final chunk.",
    )


# ---------------------------------------------------------------------------
# Error schema
# ---------------------------------------------------------------------------

class ErrorResponse(BaseModel):
    """
    Consistent error envelope returned by all routes on failure.

    Using a typed model (rather than a plain dict) means every consumer
    can rely on the same shape regardless of which endpoint failed.
    """

    request_id: str = Field(
        default_factory=lambda: str(uuid4()),
        description="Unique ID — correlate with server logs.",
    )
    code:    str = Field(..., description="Machine-readable error code (SCREAMING_SNAKE_CASE).")
    message: str = Field(..., description="Human-readable explanation.")
    details: dict[str, Any] = Field(
        default_factory=dict,
        description="Optional structured context (e.g. field-level validation errors).",
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )