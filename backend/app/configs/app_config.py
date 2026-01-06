import os
import sys
from pathlib import Path

from pydantic_settings import BaseSettings, PydanticBaseSettingsSource, SettingsConfigDict

from .deployment import DeploymentConfig
from .feature import FeatureConfig
from .middleware import MiddlewareConfig

env_file_from_env = os.getenv("ENV_FILE")
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_ENV_PATH = BASE_DIR / ".env"

# PyInstaller
if getattr(sys, "_MEIPASS", None):
    ENV_PATH = Path(sys._MEIPASS) / ".env" / ".env"
else:
    ENV_PATH = Path(env_file_from_env) if env_file_from_env else DEFAULT_ENV_PATH


class AppConfig(
    DeploymentConfig,
    FeatureConfig,
    MiddlewareConfig
):
    print(f"Reading .env from: {str(ENV_PATH)}")
    model_config = SettingsConfigDict(
        # Use top level .env file
        env_file=str(ENV_PATH),
        env_ignore_empty=True,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return (
            init_settings,
            env_settings,
            dotenv_settings,
            file_secret_settings,
        )
