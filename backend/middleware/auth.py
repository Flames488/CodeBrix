# auth.py
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
import os

# Load your API key from environment, fallback to default
API_KEY = os.getenv("API_KEY", "codebrix-secret")

# Endpoints that do NOT require authentication
PUBLIC_PATHS = [
    "/health",
    "/api/docs",
    "/api/openapi.json",
    "/redoc"
]

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow public paths without API key
        for path in PUBLIC_PATHS:
            if request.url.path.startswith(path):
                return await call_next(request)

        # Get x-api-key header
        key = request.headers.get("x-api-key")
        if key != API_KEY:
            raise HTTPException(status_code=401, detail="Unauthorized")

        return await call_next(request)