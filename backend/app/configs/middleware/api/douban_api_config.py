from pydantic import Field
from pydantic_settings import BaseSettings


class DoubanApiConfig(BaseSettings):
    DOUBAN_API_KEY: str | None = Field(
        description="Douban API Key",
        default=None,
    )
