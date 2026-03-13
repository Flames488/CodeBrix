"""
main.py
-------
Codebrix AI Platform — unified entry point.
"""

from __future__ import annotations

import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ---------------------------------------------------------------------------
# Internal imports — Automation Platform
# ---------------------------------------------------------------------------
from routes import ai_agents, automations, clients

# ---------------------------------------------------------------------------
# Internal imports — AI Receptionist
# ---------------------------------------------------------------------------
from routes import leads, chat
from routes.ai_receptionist import router as ai_receptionist_router

from core.monitoring import metrics_router
from middleware.rate_limiter import RateLimitMiddleware
from middleware.auth import AuthMiddleware

from routes import lead

# ---------------------------------------------------------------------------
# Shared loggers
# ---------------------------------------------------------------------------
from core.logger import setup_logger
from core.logger import logger as _app_logger

logger = setup_logger()


# ---------------------------------------------------------------------------
# Startup / shutdown lifecycle
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("╔══════════════════════════════════════════╗")
    logger.info("║   Codebrix Unified AI Platform starting  ║")
    logger.info("╚══════════════════════════════════════════╝")

    app.state.started_at = datetime.now(timezone.utc)

    logger.info("[AutomationPlatform] Initialising AI agent orchestration...")
    _app_logger.info("[AIReceptionist] Initialising lead & chat subsystems...")

    yield

    logger.info("[AutomationPlatform] Shutting down AI agent orchestration...")
    _app_logger.info("[AIReceptionist] Shutting down lead & chat subsystems...")
    logger.info("Codebrix Unified AI Platform stopped.")


# ---------------------------------------------------------------------------
# Create FastAPI app
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Codebrix Unified AI Platform",
    description=(
        "Unified API combining the Codebrix AI Automation Platform "
        "(agent orchestration, automations, client management) "
        "and the Codebrix AI Receptionist "
        "(intelligent lead capture and conversational chat)."
    ),
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

app.add_middleware(AuthMiddleware)

app.add_middleware(RateLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://codebrix.ai",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Request logging middleware
# ---------------------------------------------------------------------------

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000

    logger.info(
        "%s %s → %d (%.1f ms)",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )

    response.headers["X-Response-Time"] = f"{duration_ms:.1f}ms"
    return response


# ---------------------------------------------------------------------------
# Global exception handler
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(
        "Unhandled error on %s %s", request.method, request.url.path
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred. Please try again later.",
            "path": str(request.url.path),
            "method": request.method,
        },
    )


# ---------------------------------------------------------------------------
# Routes — Automation Platform
# ---------------------------------------------------------------------------

app.include_router(
    ai_agents.router,
    prefix="/api/v1/ai-agents",
    tags=["AI Agents"],
)

app.include_router(
    automations.router,
    prefix="/api/v1/automations",
    tags=["Automations"],
)

app.include_router(
    clients.router,
    prefix="/api/v1/clients",
    tags=["Clients"],
)


# ---------------------------------------------------------------------------
# Routes — AI Receptionist
# ---------------------------------------------------------------------------

app.include_router(
    leads.router,
    prefix="/api/v1/leads",
    tags=["Leads"],
)

app.include_router(
    chat.router,
    prefix="/api/v1/chat",
    tags=["Chat"],
)

app.include_router(
    ai_receptionist_router,
    prefix="/api/v1/receptionist",
    tags=["AI Receptionist"],
)

app.include_router(
    lead.router,
    prefix="/api/v1/lead",
    tags=["Lead"],
)

# ---------------------------------------------------------------------------
# Monitoring
# ---------------------------------------------------------------------------

app.include_router(
    metrics_router,
    tags=["Monitoring"],
)


# ---------------------------------------------------------------------------
# Core endpoints
# ---------------------------------------------------------------------------

@app.get("/", tags=["System"])
def root():
    return {
        "platform": "Codebrix Unified AI Platform",
        "status": "running",
        "version": app.version,
        "docs": "/api/docs",
    }


@app.get("/health", tags=["System"])
def health(request: Request):
    started_at: datetime | None = getattr(request.app.state, "started_at", None)

    uptime_seconds = (
        (datetime.now(timezone.utc) - started_at).total_seconds()
        if started_at
        else None
    )

    return {
        "status": "healthy",
        "version": app.version,
        "uptime_seconds": round(uptime_seconds, 1)
        if uptime_seconds is not None
        else None,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "components": {
            "automation_platform": "ok",
            "ai_receptionist": "ok",
        },
    }


# ---------------------------------------------------------------------------
# Render deployment entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import os
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)