import logging
from contextlib import asynccontextmanager
from pathlib import Path

import uvicorn
from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from app.api.main import api_router
from app.core.config import settings
from app.core.database import sqlite
from app.core.exception_handler import setup_exception_handlers
from app.core.logging import setup_logger

logger = logging.getLogger(__name__)

class StaticCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        if request.url.path.startswith("/book/"):
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response


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
    app.add_middleware(StaticCORSMiddleware)
    logger.info("setup_static")


def setup_cors(app: FastAPI):
    logger.info(f"setup_cors: {settings.FRONTEND_HOST}")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_HOST],
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
    logging.info(r"""

    8888888b.  d8b 888                   Y88b   d88P
    888   Y88b Y8P 888                    Y88b d88P
    888    888     888                     Y88o88P
    888   d88P 888 888  .d88b.   8888b.     Y888P
    8888888P"  888 888 d8P  Y8b     "88b    d888b
    888        888 888 88888888 .d888888   d88888b
    888        888 888 Y8b.     888  888  d88P Y88b
    888        888 888  "Y8888  "Y888888 d88P   Y88b
    """)


def start_server(app: FastAPI):
    # port = get_free_port()
    port = settings.PORT
    logger.info(f"Starting server at http://localhost:{port}, docs at http://localhost:{port}/docs")

    uvicorn.run(app, host="localhost", port=port, log_config=None)
