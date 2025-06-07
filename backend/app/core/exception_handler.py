import logging
import uuid

from fastapi import Request
from fastapi.responses import JSONResponse, Response
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


def get_trace_id(request: Request) -> str:
    return request.headers.get("X-Trace-Id") or str(uuid.uuid4())


async def http_exception_handler(request: Request, ex: StarletteHTTPException) -> Response:
    # logger.warning(f"[HTTPException] {request.url} - {ex.status_code}: {ex.detail}")
    return JSONResponse(
        status_code=ex.status_code,
        content={
            "code": ex.status_code,
            "message": ex.detail,
            "data": None
        },
    )


async def validation_exception_handler(request: Request, ex: RequestValidationError) -> Response:
    # logger.warning(f"[ValidationError] {request.url} - {ex.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "code": 422,
            "message": "Unprocessable Entity",
            "data": ex.errors()
        },
    )


async def global_exception_handler(request: Request, ex: Exception) -> Response:
    trace_id = get_trace_id(request)
    exc_type = type(ex).__name__
    exc_msg = str(ex).split('\n')[0]
    logger.error(
        f"{request.method} {request.url.path} - {exc_type}: {exc_msg}"
    )
    return JSONResponse(
        status_code=500,
        content={
            "code": 500,
            "message": "Internal Server Error",
            "data": None
        },
    )


def register_exception_handlers(app):
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)
