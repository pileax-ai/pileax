from fastapi import FastAPI

from app.api.routes import api_router
from app.core.config import settings

order = 1

def setup(app: FastAPI):
    app.include_router(api_router, prefix=settings.API_V1_STR)
