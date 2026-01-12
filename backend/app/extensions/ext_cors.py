import logging

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.configs import app_config

logger = logging.getLogger(__name__)
order = 98


def setup(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=app_config.WEB_API_CORS_ALLOW_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info("origin: %s, cookie domain: %s", app_config.WEB_API_CORS_ALLOW_ORIGINS, app_config.COOKIE_DOMAIN)
