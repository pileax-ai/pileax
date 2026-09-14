import json
import logging
import os

from fastapi import FastAPI

from app.api.models.provider import LLMConfigInfo
from app.configs import app_config
from app.libs.file_utils import get_root_dir
from app.libs.provider_helper import ProviderHelper

logger = logging.getLogger(__name__)
order = 2


def setup(app: FastAPI):
    try:
        with open(os.path.join(get_root_dir(), "conf", "llm_config.json")) as f:
            # app_config.FACTORY_LLM_INFOS = json.load(f)["factory_llm_infos"]
            llm_config = json.load(f)
            app_config.LLM_CONFIG = LLMConfigInfo(**llm_config)
    except Exception:
        app_config.LLM_CONFIG = None
        logger.exception("❌ Failed to load LLM config.")


def sync_providers():
    llm_config = app_config.LLM_CONFIG
    if llm_config:
        ProviderHelper.sync_providers(llm_config)
