from fastapi import APIRouter

from app.api.routes import system
from app.api.routes import user

api_router = APIRouter()
api_router.include_router(system.router)
api_router.include_router(user.router)
