import time

from fastapi import APIRouter

from app.api.router import Response, send_ok

router = APIRouter(prefix="/system", tags=["System"])


@router.get("/health-check", response_model=Response)
def health_check():
    """
    Check the system health
    """
    data = {"timestamp": time.time()}
    return send_ok(data)
