import secrets
from typing import Annotated, Any, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Use top level .env file
        env_file="./.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 14 days = 14 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 14
    FRONTEND_HOST: str = "http://localhost:5173"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"
    APP_MODE: Literal["SINGLE", "MULTIPLE"] = "SINGLE"
    PROJECT_NAME: str = ""


settings = Settings()
