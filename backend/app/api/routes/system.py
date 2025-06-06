from fastapi import APIRouter, HTTPException
import time

from app.api.models.response import Response, send_ok

router = APIRouter(prefix="/system", tags=["System"])

@router.get("/heartbeat", response_model=Response)
def heartbeat():
    """
    Get system heartbeat
    """
    data = { "timestamp": time.time() }
    return send_ok(data)
