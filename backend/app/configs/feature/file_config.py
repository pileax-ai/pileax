from pydantic import Field
from pydantic_settings import BaseSettings


class FileConfig(BaseSettings):
    PUBLIC_FILE_ROOT: str = Field(
        description="Public file root path",
        default="./public",
    )

