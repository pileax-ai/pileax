from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html

from app.configs import app_config

order = 1


def is_enabled():
    return app_config.SWAGGER_UI_ENABLED


def setup(app: FastAPI):
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
