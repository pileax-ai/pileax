from fastapi import APIRouter, HTTPException
import time

router = APIRouter(prefix="/system", tags=["System"])

@router.get("/heartbeat")
def heartbeat():
    """
    Get system heartbeat
    """
    return { "timestamp": time.time() }
