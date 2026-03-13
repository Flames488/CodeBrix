import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.core.logger import logger


class RequestLoggerMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        start = time.time()

        response = await call_next(request)

        duration = round(time.time() - start, 3)

        logger.info(
            f"{request.method} {request.url.path} "
            f"status={response.status_code} "
            f"time={duration}s"
        )

        return response