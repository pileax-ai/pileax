from typing import List

from app.configs import app_config


class ProviderHelper:
    @staticmethod
    def get_providers() -> List[dict]:
        return app_config.FACTORY_LLM_INFOS

    @staticmethod
    def get_provider(provider_id: str) -> dict | None:
        return next(
            (x for x in app_config.FACTORY_LLM_INFOS if x["name"].lower() == provider_id.lower()),
            None
        )

