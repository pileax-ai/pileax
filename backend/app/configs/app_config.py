import logging
import os
import shutil
import sys
from pathlib import Path
from typing import ClassVar

from dotenv import dotenv_values, set_key
from pydantic_settings import BaseSettings, PydanticBaseSettingsSource, SettingsConfigDict

from .deployment import DeploymentConfig
from .feature import FeatureConfig
from .middleware import MiddlewareConfig

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_ENV_PATH = BASE_DIR / ".env"


def prepare_env() -> Path:
    """
    Locates or initializes the .env file.
    If the specified path doesn't exist in a PyInstaller bundle,
    it copies the template from the bundle to the target location.
    """
    # 1. Determine the desired path from environment variable or default
    env_file_from_env = os.getenv("ENV_FILE")
    target_path = Path(env_file_from_env) if env_file_from_env else DEFAULT_ENV_PATH
    logging.warning("⚙ Initializing .env: %s", env_file_from_env)

    # 2. Regular
    meipass = getattr(sys, "_MEIPASS", None)
    if not meipass:
        return target_path

    # 3. PyInstaller environment
    env_template = Path(meipass) / ".env.example"
    if not env_template.exists():
        return target_path

    if not target_path.exists():
        try:
            # Ensure the parent directory exists (critical for userData paths)
            target_path.parent.mkdir(parents=True, exist_ok=True)

            # Copy template to the target writable location
            shutil.copy(env_template, target_path)
            logging.warning("⚙ Initialized .env from template: %s", target_path)
        except Exception as e:
            # Fallback to the bundle template if copy fails (e.g., permission issues)
            logging.exception("❌ Failed to copy .env template")
            return env_template
    else:
        sync_env_with_dotenv(env_template, target_path)

    return target_path


def sync_env_with_dotenv(template_path: Path, target_path: Path):
    """
    Safely syncs missing keys from template to target using set_key.
    """
    try:
        # Load keys from both files without loading them into environment variables
        template_data = dotenv_values(template_path)
        target_data = dotenv_values(target_path)

        updated_count = 0
        for key, value in template_data.items():
            # Only add the key if it doesn't exist in the target .env
            if key not in target_data:
                # set_key handles file writing and ensures correct formatting
                set_key(str(target_path), key, str(value or ""), quote_mode="always")
                updated_count += 1
                logging.info("⚙ Synced missing config: %s", key)

        if updated_count > 0:
            logging.warning("⚙ .env update complete: %s new key(s) added.", updated_count)

    except Exception as e:
        logging.exception("❌ Error syncing with python-dotenv")


class AppConfig(DeploymentConfig, FeatureConfig, MiddlewareConfig):
    ENV_PATH: ClassVar[Path] = prepare_env()

    logging.warning("Readings .env from: %s", str(ENV_PATH))
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
