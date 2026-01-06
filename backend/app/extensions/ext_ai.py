import json
import os

from fastapi import FastAPI

from app.configs import app_config
from app.libs.file_utils import get_root_dir

order = 2


def setup(app: FastAPI):
    try:
        with open(os.path.join(get_root_dir(), "conf", "llm_providers.json")) as f:
            app_config.FACTORY_LLM_INFOS = json.load(f)["factory_llm_infos"]
    except Exception:
        app_config.FACTORY_LLM_INFOS = []
