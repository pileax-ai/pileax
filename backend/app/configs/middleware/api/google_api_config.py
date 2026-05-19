from pydantic import Field
from pydantic_settings import BaseSettings


class GoogleApiConfig(BaseSettings):
    GOOGLE_API_KEY: str | None = Field(
        description="Google API Key",
        default=None,
    )
