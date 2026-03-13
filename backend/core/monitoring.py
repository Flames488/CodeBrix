from fastapi import APIRouter
import psutil

metrics_router = APIRouter()


def get_system_metrics() -> dict:
    """Return current CPU and memory utilisation."""
    return {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
    }


@metrics_router.get("/metrics", tags=["Monitoring"], summary="Service health and system metrics")
def metrics():
    return {
        "service": "codebrix-ai-receptionist",
        "status": "running",
        "system": get_system_metrics(),
    }