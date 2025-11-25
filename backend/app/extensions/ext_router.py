from fastapi import FastAPI

from app.api.routes import api_router
from app.configs import app_config

order = 2

def setup(app: FastAPI):
    app.include_router(api_router, prefix=app_config.API_VERSION)
