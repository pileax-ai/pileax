from pydantic import Field
from pydantic_settings import BaseSettings


class SwaggerUIConfig(BaseSettings):
    SWAGGER_UI_ENABLED: bool = Field(
        description="Whether to enable Swagger UI in api module",
        default=True,
    )

    SWAGGER_UI_PATH: str = Field(
        description="Swagger UI page path in api module",
        default="/swagger-ui.html",
    )
