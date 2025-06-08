import logging
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from app.api.main import api_router
from app.core.config import settings
from app.core.database import sqlite
from app.core.exception_handler import setup_exception_handlers
from app.core.logging import setup_logger
from app.utils.http_util import get_free_port

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    logger.info('startup')
    sqlite.create_db_and_tables()

    yield
    # shutdown
    logger.info('shutdown')


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

def setup_static(app: FastAPI):
    static_path = Path(settings.PUBLIC_ROOT).resolve()
    app.mount("/", StaticFiles(directory=static_path), name="root")


def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

def initialization(app: FastAPI):
    setup_logger()
    setup_docs(app)
    setup_routes(app)
    setup_static(app)
    setup_cors(app)
    setup_exception_handlers(app)
    logger.info("Initialization completed")


def start_server(app: FastAPI):
    port = get_free_port()
    logger.info(f"Starting server at http://localhost:{port}, docs at http://localhost:{port}/docs")
    uvicorn.run(app, host="localhost", port=port)
