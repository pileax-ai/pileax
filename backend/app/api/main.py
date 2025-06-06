from fastapi import APIRouter

from app.api.routes import auth, system, user

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(system.router)
api_router.include_router(user.router)
