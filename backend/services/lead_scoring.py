"""
app/agents/lead_scoring.py
--------------------------
Intelligent lead scoring engine for the Codebrix AI Receptionist.

Scoring model
-------------
Signals are grouped into weighted categories. Each category contributes
independently so a lead that mentions multiple high-value signals
accumulates score addictively up to a configurable cap.

Score bands
-----------
  0  – 29  : Cold    — low intent, nurture only
  30 – 59  : Warm    — moderate intent, queue for follow-up
  60 – 84  : Hot     — strong intent, prioritise outreach
  85 – 100 : Premium — immediate high-value opportunity
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from core.logger import logger


# ---------------------------------------------------------------------------
# Signal definitions
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class Signal:
    """A single keyword/phrase signal with its point value and category."""
    keyword: str
    points: int
    category: str


# Ordered from highest to lowest value so logs read naturally.
SIGNALS: list[Signal] = [
    # High-value commercial intent
    Signal("enterprise",       35, "commercial"),
    Signal("contract",         30, "commercial"),
    Signal("pricing",          25, "commercial"),
    Signal("price",            20, "commercial"),
    Signal("budget",           20, "commercial"),
    Signal("invoice",          15, "commercial"),
    Signal("payment",          15, "commercial"),

    # Product interest
    Signal("automation",       30, "product"),
    Signal("ai agent",         30, "product"),
    Signal("ai",               25, "product"),
    Signal("workflow",         20, "product"),
    Signal("integration",      20, "product"),
    Signal("api",              15, "product"),
    Signal("chatbot",          15, "product"),

    # Urgency / timeline
    Signal("urgent",           25, "urgency"),
    Signal("asap",             25, "urgency"),
    Signal("immediately",      20, "urgency"),
    Signal("this week",        20, "urgency"),
    Signal("deadline",         15, "urgency"),

    # Engagement intent
    Signal("demo",             20, "engagement"),
    Signal("call",             15, "engagement"),
    Signal("schedule",         15, "engagement"),
    Signal("consult",          15, "engagement"),
    Signal("meeting",          10, "engagement"),
    Signal("book",             10, "engagement"),

    # Company size signals
    Signal("team",             10, "scale"),
    Signal("scale",            10, "scale"),
    Signal("startup",           5, "scale"),
]

# Maximum achievable score (clamp raw totals to this)
MAX_SCORE = 100

# Score band thresholds
BANDS: list[tuple[int, str]] = [
    (85, "premium"),
    (60, "hot"),
    (30, "warm"),
    (0,  "cold"),
]


# ---------------------------------------------------------------------------
# Result model
# ---------------------------------------------------------------------------

@dataclass
class ScoreResult:
    lead: dict[str, Any]
    score: int
    band: str
    matched_signals: list[dict[str, Any]]
    category_breakdown: dict[str, int]

    def to_dict(self) -> dict[str, Any]:
        return {
            "lead": self.lead,
            "score": self.score,
            "band": self.band,
            "matched_signals": self.matched_signals,
            "category_breakdown": self.category_breakdown,
        }


# ---------------------------------------------------------------------------
# Scorer
# ---------------------------------------------------------------------------

class LeadScorer:
    """
    Score an inbound lead based on keyword signals found in its message.

    Usage
    -----
        scorer = LeadScorer()
        result = scorer.score({"session_id": "abc", "message": "I need AI automation pricing ASAP"})
        print(result.band)   # "hot"
    """

    def score(self, lead: dict[str, Any]) -> ScoreResult:
        """
        Analyse the lead message and return a structured ScoreResult.

        Parameters
        ----------
        lead : dict
            Must contain at least a ``"message"`` key. All other keys are
            passed through unchanged in the result.

        Returns
        -------
        ScoreResult
            Dataclass with score, band, matched signals, and category breakdown.
        """
        message = lead.get("message", "")
        if not isinstance(message, str):
            logger.warning("[LeadScorer] Non-string message for lead %s — defaulting to empty.", lead)
            message = ""

        normalised = message.lower()

        raw_score = 0
        matched: list[dict[str, Any]] = []
        category_totals: dict[str, int] = {}

        for signal in SIGNALS:
            if signal.keyword in normalised:
                raw_score += signal.points
                category_totals[signal.category] = (
                    category_totals.get(signal.category, 0) + signal.points
                )
                matched.append({
                    "keyword": signal.keyword,
                    "points": signal.points,
                    "category": signal.category,
                })

        final_score = min(raw_score, MAX_SCORE)
        band = _resolve_band(final_score)

        logger.info(
            "[LeadScorer] session=%s | score=%d | band=%s | signals=%d",
            lead.get("session_id", "unknown"),
            final_score,
            band,
            len(matched),
        )

        return ScoreResult(
            lead=lead,
            score=final_score,
            band=band,
            matched_signals=matched,
            category_breakdown=category_totals,
        )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _resolve_band(score: int) -> str:
    """Map a numeric score to its named band."""
    for threshold, label in BANDS:
        if score >= threshold:
            return label
    return "cold"
