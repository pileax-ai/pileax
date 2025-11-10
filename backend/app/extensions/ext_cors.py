import logging

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.core.config import settings

logger = logging.getLogger(__name__)
order = 98


def setup(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_HOST],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info(f"{settings.FRONTEND_HOST}")
