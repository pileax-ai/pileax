from fastapi import FastAPI

from app.core.config import settings
from app.core.lifecycle import lifespan, initialization


def create_app() -> FastAPI:
    """
    @metadata https://fastapi.tiangolo.com/zh/tutorial/metadata/
    """
    app = FastAPI(
        lifespan=lifespan,
        title=settings.PROJECT_NAME,
        version="0.0.1",
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url=None
    )
    initialization(app)

    return app
