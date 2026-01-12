from fastapi import FastAPI

from app.app_lifecycle import initialization, lifespan
from app.configs import app_config


def create_app() -> FastAPI:
    """
    @metadata https://fastapi.tiangolo.com/zh/tutorial/metadata/
    """
    app = FastAPI(
        lifespan=lifespan,
        title=app_config.APPLICATION_NAME,
        version="0.0.1",
        openapi_url=f"{app_config.API_VERSION}/openapi.json",
        docs_url=None,
    )
    initialization(app)

    return app
