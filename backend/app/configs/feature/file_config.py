from pydantic import Field
from pydantic_settings import BaseSettings


class FileConfig(BaseSettings):
    CACHE_ROOT: str = Field(
        description="Public file root path",
        default=".cache",
    )
    PUBLIC_FILE_ROOT: str = Field(
        description="Public file root path",
        default="./public",
    )
