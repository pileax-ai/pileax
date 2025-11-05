import os
import secrets
import sys
from pathlib import Path
from typing import Annotated, Any, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict

env_file_from_env = os.getenv("ENV_FILE")
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_ENV_PATH = BASE_DIR / ".env"

# PyInstaller
if getattr(sys, "_MEIPASS", None):
    ENV_PATH = Path(sys._MEIPASS) / ".env" / ".env"
else:
    ENV_PATH = Path(env_file_from_env) if env_file_from_env else DEFAULT_ENV_PATH


class Settings(BaseSettings):
    print(f"Reading .env from: {str(ENV_PATH)}")
    model_config = SettingsConfigDict(
        # Use top level .env file
        env_file=str(ENV_PATH),
        env_ignore_empty=True,
        extra="ignore",
    )
    PORT: int = 38000
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(64)
    # 60 minutes * 24 hours * 1 days = 1 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 1
    FRONTEND_HOST: str = "http://localhost:21800"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"
    APP_MODE: Literal["SINGLE", "MULTIPLE"] = "SINGLE"
    PROJECT_NAME: str = "PileaX"
    DATABASE_URL: str = "/storage/metadata.db"
    PUBLIC_ROOT: str = "./storage/public"


settings = Settings()
