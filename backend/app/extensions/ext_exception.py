import logging
import re
import uuid

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)
order = 99


def get_cors_response(response: JSONResponse):
    response.headers["Access-Control-Allow-Origin"] = "*"
    # response.headers["Access-Control-Allow-Methods"] = "*"
    # response.headers["Access-Control-Allow-Headers"] = "*"
    return response


def get_trace_id(request: Request) -> str:
    return request.headers.get("X-Trace-Id") or str(uuid.uuid4())


async def http_exception_handler(request: Request, ex: StarletteHTTPException):
    # logger.warning(f"[HTTPException] {request.url} - {ex.status_code}: {ex.detail}")
    response = JSONResponse(
        status_code=ex.status_code,
        content={
            "code": ex.status_code,
            "message": ex.detail,
            "data": None
        },
    )
    return get_cors_response(response)


async def validation_exception_handler(request: Request, ex: RequestValidationError):
    # logger.warning(f"[ValidationError] {request.url} - {ex.errors()}")
    response = JSONResponse(
        status_code=422,
        content={
            "code": 422,
            "message": "Unprocessable Entity",
            "data": ex.errors()
        },
    )
    return get_cors_response(response)


async def integrity_exception_handler(request: Request, ex: IntegrityError):
    trace_id = get_trace_id(request)
    exc_type = type(ex).__name__
    exc_msg = str(ex).split('\n')[0]
    logger.error(
        f"{request.method} {request.url.path} - {exc_type}: {exc_msg}"
    )
    cleaned_msg = re.sub(r"^\([^\)]*\)\s*", "", exc_msg)
    return JSONResponse(
        status_code=400,
        content={
            "code": 400,
            "message": cleaned_msg,
            "data": None
        },
    )


async def global_exception_handler(request: Request, ex: Exception):
    trace_id = get_trace_id(request)
    exc_type = type(ex).__name__
    exc_msg = str(ex).split('\n')[0]
    logger.error(
        f"{request.method} {request.url.path} - {exc_type}: {exc_msg}"
    )
    cleaned_msg = re.sub(r"^\([^\)]*\)\s*", "", exc_msg)
    response = JSONResponse(
        status_code=500,
        content={
            "code": 500,
            "message": cleaned_msg,
            "data": None,
        }
    )
    return get_cors_response(response)


def setup(app):
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(IntegrityError, integrity_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)
