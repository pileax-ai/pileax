from pydantic import Field
from pydantic_settings import BaseSettings


class GoogleApiConfig(BaseSettings):
    GOOGLE_API_KEY: str = Field(
        description="Google API Key",
        default=None,
    )
