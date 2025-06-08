from fastapi import FastAPI

from app.core.config import settings
from app.core.lifecycle import lifespan, start_server
from app.core.lifecycle import initialization

# FastAPI
# see: https://fastapi.tiangolo.com/zh/tutorial/metadata/
app = FastAPI(
    lifespan=lifespan,
    title="PileaX",
    version="0.0.1",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=None
)
initialization(app)


if __name__ == "__main__":
    start_server(app)
