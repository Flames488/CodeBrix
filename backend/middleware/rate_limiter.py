
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException
import time

requests = {}

class RateLimitMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        ip = request.client.host
        now = time.time()

        window = 60
        limit = 60

        if ip not in requests:
            requests[ip] = []

        requests[ip] = [t for t in requests[ip] if now - t < window]

        if len(requests[ip]) >= limit:
            raise HTTPException(status_code=429, detail="Too many requests")

        requests[ip].append(now)

        return await call_next(request)
