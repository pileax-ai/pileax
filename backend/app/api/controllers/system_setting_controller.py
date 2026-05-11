import logging
import os
from typing import Any

from dotenv import set_key
from fastapi import HTTPException

from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.configs import app_config

logger = logging.getLogger(__name__)


class SystemSettingController:
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        pass

    def update_setting_item(self, key: str, value: Any) -> None:
        """
        Update a setting both in memory and on disk (.env file).
        """
        if not app_config.ENV_PATH.exists():
            raise HTTPException(status_code=404, detail="env file not found")

        try:
            # 1. Prepare string value for .env
            str_value = str(value)

            # 2. Save to Disk (.env file)
            set_key(str(app_config.ENV_PATH), key.upper(), str_value, quote_mode="always")
            logger.info("💾 Saved %s to %s", key, app_config.ENV_PATH)

            # 3. Update Memory (os.environ)
            # This ensures any code calling os.getenv() gets the new value immediately
            os.environ[key.upper()] = str_value

            # 4. Update Memory (Pydantic Config Instance)
            # Convert key to lowercase if your pydantic fields are lowercase (standard practice)
            attr_name = key.upper()
            if hasattr(app_config, attr_name):
                # Directly updating the attribute on the live config object
                setattr(app_config, attr_name, value)
            else:
                logger.warning("⚠️ Field '%s' not found in AppConfig, disk only updated.", attr_name)

        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Failed to update {key}")

    def get_settings(self) -> Any:
        settings = app_config.model_dump()
        return settings
