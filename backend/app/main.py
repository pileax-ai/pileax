import logging
import uvicorn
from typing import Union
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from app.api.main import api_router
from app.api.models import response
from app.core.config import settings
from app.core.database import sqlite

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI
# see: https://fastapi.tiangolo.com/zh/tutorial/metadata/
app = FastAPI(
    title="PileaX",
    version="0.0.1",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.on_event("startup")
async def startup():
    sqlite.create_db_and_tables()
    logger.info("Initializing service")


# 全局异常处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=response.send_error(str(exc.detail), exc.status_code).dict()
    )


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
