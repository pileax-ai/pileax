import logging
from pathlib import Path

from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.staticfiles import StaticFiles

from app.configs import app_config

logger = logging.getLogger(__name__)
order = 97


class StaticCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        if request.url.path.startswith("/book/"):
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response


def setup(app: FastAPI):
    static_path = Path(app_config.PUBLIC_FILE_ROOT).resolve()

    if not static_path.exists():
        static_path.mkdir(parents=True, exist_ok=True)

    app.mount("/", StaticFiles(directory=static_path), name="root")
    app.add_middleware(StaticCORSMiddleware)

    logger.info("%s", static_path)
