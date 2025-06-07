import logging

from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html

from app.api.main import api_router
from app.core.config import settings
from app.core.database import sqlite
from app.core.exception_handler import setup_exception_handlers
from app.core.logging import setup_logger

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def setup_events(app: FastAPI):
    @app.on_event("startup")
    async def startup():
        sqlite.create_db_and_tables()
        logger.info("Initializing service")


def setup_docs(app: FastAPI):
    @app.get("/docs", include_in_schema=False)
    async def custom_swagger_ui_html():
        """
        Set persistAuthorization
        """
        return get_swagger_ui_html(
            openapi_url=app.openapi_url,
            title="PileaX",
            swagger_ui_parameters={"persistAuthorization": True},
        )

def setup_routes(app: FastAPI):
    app.include_router(api_router, prefix=settings.API_V1_STR)


def initialization(app: FastAPI):
    setup_logger()
    setup_events(app)
    setup_docs(app)
    setup_routes(app)
    setup_exception_handlers(app)
