"""
agent_brain.py
==============
Production-grade agentic loop for Codebrix AI.

Key improvements over the original
------------------------------------
* OpenAI **function-calling** (tool_use) instead of brittle string parsing.
* **Multi-turn agentic loop** — the model can chain multiple tool calls in a
  single user turn before producing a final answer.
* Typed dataclasses for every boundary object (AgentRequest, AgentResponse).
* Structured, levelled **logging** (no bare print statements).
* Explicit **retry logic** with exponential back-off for transient API errors.
* Clean separation of concerns: message building, tool dispatch, memory I/O,
  and the main loop are all distinct functions.
* Rich docstrings and type hints throughout.
"""

from __future__ import annotations

import json
import logging
import time
from dataclasses import dataclass, field
from typing import Any

from openai import OpenAI, APIError, APITimeoutError, RateLimitError
from openai.types.chat import ChatCompletionMessageParam

from core.config import settings
from services.memory.vector_memory import recall_memory, store_memory
from services.tools.tools import TOOLS

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# OpenAI client
# ---------------------------------------------------------------------------

client = OpenAI(api_key=settings.OPENAI_API_KEY)

MODEL        = "gpt-4.1-mini"
MAX_RETRIES  = 3
RETRY_DELAY  = 1.5   # seconds (doubles on each retry)
MAX_STEPS    = 10    # safety cap on the agentic loop

# ---------------------------------------------------------------------------
# System prompt
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are Codebrix AI — a precise, helpful, and honest assistant.

When you need to perform arithmetic or mathematical operations, you MUST use the
`calculator` tool rather than computing values yourself.  For every other request,
answer directly using your knowledge and the conversation context provided.

Rules:
- Always be concise and accurate.
- Never fabricate facts.
- If you are unsure, say so.
"""

# ---------------------------------------------------------------------------
# OpenAI tool schema  (mirrors the TOOLS registry)
# ---------------------------------------------------------------------------

TOOL_SCHEMAS: list[dict[str, Any]] = [
    {
        "type": "function",
        "function": {
            "name": "calculator",
            "description": (
                "Safely evaluate a mathematical expression. "
                "Supports arithmetic, scientific functions (sin, cos, log, sqrt, …), "
                "constants (pi, e, phi), and combinatorics (factorial, comb, perm). "
                "Example inputs: '2 + 3 * 4', 'sqrt(144)', 'sin(pi/6)', 'log(e^3)'."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "The mathematical expression to evaluate.",
                    }
                },
                "required": ["expression"],
            },
        },
    }
]

# ---------------------------------------------------------------------------
# Typed I/O objects
# ---------------------------------------------------------------------------

@dataclass
class AgentRequest:
    user_id:  str
    prompt:   str
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class AgentResponse:
    reply:       str
    tool_calls:  list[dict[str, Any]] = field(default_factory=list)
    steps:       int = 0
    success:     bool = True
    error:       str | None = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _build_messages(
    system: str,
    memory_context: str,
    prompt: str,
) -> list[ChatCompletionMessageParam]:
    """Construct the initial message list sent to the model."""
    messages: list[ChatCompletionMessageParam] = [
        {"role": "system", "content": system},
    ]
    if memory_context:
        messages.append({
            "role": "system",
            "content": f"[Relevant memory from past conversations]\n{memory_context}",
        })
    messages.append({"role": "user", "content": prompt})
    return messages


def _dispatch_tool(name: str, arguments: dict[str, Any]) -> str:
    """
    Execute a registered tool and return its string result.
    Unknown tools return a descriptive error string (never raise).
    """
    if name not in TOOLS:
        log.warning("Model requested unknown tool %r — returning error string.", name)
        return f"Error: tool {name!r} is not available."

    try:
        log.debug("Dispatching tool %r with args %s", name, arguments)
        result = TOOLS[name](**arguments)
        log.debug("Tool %r returned: %s", name, result)
        return str(result)
    except Exception as exc:  # noqa: BLE001
        log.error("Tool %r raised an exception: %s", name, exc, exc_info=True)
        return f"Error executing {name}: {exc}"


def _call_model(
    messages: list[ChatCompletionMessageParam],
    *,
    use_tools: bool = True,
) -> Any:
    """
    Call the OpenAI chat completions API with exponential-back-off retries.
    Returns the raw API response object.
    """
    kwargs: dict[str, Any] = {
        "model":    MODEL,
        "messages": messages,
    }
    if use_tools:
        kwargs["tools"]       = TOOL_SCHEMAS
        kwargs["tool_choice"] = "auto"

    delay = RETRY_DELAY
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            return client.chat.completions.create(**kwargs)
        except RateLimitError:
            log.warning("Rate-limited by OpenAI (attempt %d/%d). Waiting %.1fs …",
                        attempt, MAX_RETRIES, delay)
        except APITimeoutError:
            log.warning("OpenAI request timed out (attempt %d/%d). Waiting %.1fs …",
                        attempt, MAX_RETRIES, delay)
        except APIError as exc:
            log.error("OpenAI API error on attempt %d: %s", attempt, exc)
            if attempt == MAX_RETRIES:
                raise
        time.sleep(delay)
        delay *= 2

    raise RuntimeError("Exhausted all retries when calling OpenAI API.")


# ---------------------------------------------------------------------------
# Core agentic loop
# ---------------------------------------------------------------------------

def _agentic_loop(
    messages: list[ChatCompletionMessageParam],
) -> tuple[str, list[dict[str, Any]], int]:
    """
    Run the tool-calling loop until the model produces a plain text reply
    or the step cap is hit.

    Returns
    -------
    reply      : str                    — final assistant message
    tool_calls : list[dict]             — log of every tool invocation
    steps      : int                    — number of loop iterations
    """
    tool_log: list[dict[str, Any]] = []

    for step in range(1, MAX_STEPS + 1):
        response  = _call_model(messages)
        message   = response.choices[0].message

        # Append the raw assistant turn to the running context
        messages.append(message.model_dump(exclude_unset=True))  # type: ignore[arg-type]

        # ── No tool calls → model is done ──────────────────────────────────
        if not message.tool_calls:
            log.info("Agent finished after %d step(s).", step)
            return message.content or "", tool_log, step

        # ── Process each tool call ──────────────────────────────────────────
        for tc in message.tool_calls:
            fn_name = tc.function.name
            try:
                fn_args = json.loads(tc.function.arguments)
            except json.JSONDecodeError as exc:
                fn_args = {}
                log.error("Could not parse tool arguments for %r: %s", fn_name, exc)

            result = _dispatch_tool(fn_name, fn_args)

            tool_log.append({
                "tool":      fn_name,
                "arguments": fn_args,
                "result":    result,
                "step":      step,
            })

            # Feed the tool result back into the conversation
            messages.append({
                "role":         "tool",
                "tool_call_id": tc.id,
                "content":      result,
            })

    # Safety: hit step cap — ask the model to summarise what it has so far
    log.warning("Agentic loop hit MAX_STEPS (%d). Requesting final summary.", MAX_STEPS)
    messages.append({
        "role":    "user",
        "content": "Please provide your final answer based on the work done so far.",
    })
    response = _call_model(messages, use_tools=False)
    final    = response.choices[0].message.content or ""
    return final, tool_log, MAX_STEPS


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def run_agent(user_id: str, prompt: str) -> str:
    """
    Backward-compatible entry point.  Accepts plain strings and returns a
    plain string reply, mirroring the original signature.

    For richer control, use :func:`run_agent_full` which accepts an
    :class:`AgentRequest` and returns an :class:`AgentResponse`.
    """
    response = run_agent_full(AgentRequest(user_id=user_id, prompt=prompt))
    return response.reply


def run_agent_full(request: AgentRequest) -> AgentResponse:
    """
    Full agentic pipeline:

    1. Retrieve relevant memories for the user.
    2. Build the initial message list.
    3. Run the multi-step tool-calling loop.
    4. Persist the exchange to memory.
    5. Return a structured :class:`AgentResponse`.
    """
    log.info("Agent invoked — user=%r  prompt=%r", request.user_id, request.prompt[:80])

    # 1. Memory retrieval
    try:
        raw_memories: list[str] = recall_memory(request.user_id)
        memory_context = "\n".join(raw_memories)
        log.debug("Recalled %d memory snippet(s).", len(raw_memories))
    except Exception as exc:  # noqa: BLE001
        log.error("Memory recall failed: %s", exc, exc_info=True)
        memory_context = ""

    # 2. Build messages
    messages = _build_messages(SYSTEM_PROMPT, memory_context, request.prompt)

    # 3. Agentic loop
    try:
        reply, tool_calls, steps = _agentic_loop(messages)
    except Exception as exc:  # noqa: BLE001
        log.error("Agentic loop failed: %s", exc, exc_info=True)
        return AgentResponse(
            reply=f"I encountered an error and could not complete your request: {exc}",
            success=False,
            error=str(exc),
        )

    # 4. Persist to memory
    try:
        store_memory(request.user_id, f"User: {request.prompt}")
        store_memory(request.user_id, f"AI: {reply}")
    except Exception as exc:  # noqa: BLE001
        log.error("Memory storage failed: %s", exc, exc_info=True)
        # Non-fatal — the reply is still valid

    log.info("Agent reply ready (%d chars, %d tool call(s)).", len(reply), len(tool_calls))

    return AgentResponse(
        reply=reply,
        tool_calls=tool_calls,
        steps=steps,
        success=True,
    )