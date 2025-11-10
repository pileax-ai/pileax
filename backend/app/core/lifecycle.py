import asyncio
import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.core.database import sqlite
from app.extensions import setup_extensions
from app.extensions import ext_database

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await asyncio.to_thread(ext_database.setup)

    # startup log
    logger.info("===== startup =====")

    yield
    # shutdown
    logger.info("===== shutdown =====\n\n")


def initialization(app: FastAPI):
    setup_extensions(app)
    logger.info("Initialization completed")
    logging.info(r"""

    8888888b.     d8b    888                    Y88b   d88P
    888   Y88b    Y8P    888                     Y88b d88P
    888    888           888                      Y88o88P
    888   d88P    888    888   .d88b.   8888b.     Y888P
    8888888P"     888    888  d8P  Y8b     "88b    d888b
    888           888    888  88888888 .d888888   d88888b
    888           888    888  Y8b.     888  888  d88P Y88b
    888           888    888   "Y8888  "Y888888 d88P   Y88b
    """)


def start_server(app: FastAPI):
    """
    Start using python main.py
    :param app:
    :return:
    """
    port = settings.PORT
    logger.info(f"Starting server at http://localhost:{port}, docs at http://localhost:{port}/docs")

    uvicorn.run(app, host="localhost", port=port, log_config=None)
