import json
import logging
import urllib.request

from fastapi import HTTPException
from packaging import version

from app.api.models.provider import LLMConfigInfo, ProviderInfo
from app.api.services.llm_provider_service import LLMProviderService
from app.api.services.llm_service import LLMService
from app.configs import app_config
from app.extensions.ext_database import get_session

logger = logging.getLogger(__name__)


class ProviderHelper:
    @staticmethod
    def get_providers() -> list[ProviderInfo]:
        return app_config.LLM_CONFIG.providers

    @staticmethod
    def get_provider(provider_id: str) -> ProviderInfo | None:
        provider = next((x for x in app_config.LLM_CONFIG.providers if x.name.lower() == provider_id.lower()), None)
        if provider:
            return ProviderInfo.model_validate(provider)
        return None

    @staticmethod
    def update_online() -> bool:
        try:
            # Request online JSON with a 10-second timeout
            req = urllib.request.Request(
                app_config.LLM_CONFIG_URL,
                headers={"User-Agent": "Mozilla/5.0"},  # Prevent basic bot blocking
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                llm_config = json.loads(response.read().decode("utf-8"))
                app_config.LLM_CONFIG = LLMConfigInfo(**llm_config)
                ProviderHelper.sync_providers(app_config.LLM_CONFIG)
                return True
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to fetch or parse config file.")

    @staticmethod
    def sync_providers(llm_config: LLMConfigInfo) -> None:
        target_version = llm_config.version
        providers = llm_config.providers

        # check version
        is_version_ok = ProviderHelper.check_version(target_version)
        if not is_version_ok:
            logger.info("⚙️ LLM Config %s exists or updated.", target_version)
            return

        # sync
        with get_session() as session:
            provider_service = LLMProviderService(session)
            llm_service = LLMService(session)

            for provider_info in providers:
                # provider
                provider_dict = provider_info.model_dump(exclude={"models"})
                provider_dict["version"] = target_version

                try:
                    provider_service.sync_provider(provider_dict)
                except Exception as e:
                    logger.exception("⚠️ Failed to sync provider: %s. %s", provider_info.name, str(e))
                    continue

                # model
                models = provider_info.models
                for model in models:
                    model_dict = model.model_dump()
                    model_dict["provider"] = provider_info.name

                    try:
                        llm_service.sync_model(model_dict)
                    except Exception as e:
                        logger.exception(
                            "⚠️ Failed to sync model: %s-%s. %s", provider_info.name, model.model_name, str(e)
                        )
                        continue

    @staticmethod
    def check_version(target_version: str) -> bool:
        with get_session() as session:
            provider_service = LLMProviderService(session)
            latest_provider = provider_service.find_one(sort={"update_time": "desc"})
            if latest_provider:
                return version.parse(target_version) > version.parse(latest_provider.version)
            else:
                return True

    @staticmethod
    def load_providers():
        with get_session() as session:
            provider_service = LLMProviderService(session)
            providers = provider_service.find_provider_models()
            provider_infos: list[ProviderInfo] = [ProviderInfo(**(item.model_dump())) for item in providers]
            app_config.LLM_CONFIG = LLMConfigInfo(version="system", providers=provider_infos)
