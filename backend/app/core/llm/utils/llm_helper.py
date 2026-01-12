from fastapi import HTTPException

from app.constants.enums import LLMType
from app.core.llm.models import ChatModel
from app.libs.provider_helper import ProviderHelper


class LLMHelper:
    @staticmethod
    def validate_api_key(provider: str, api_key: str, base_url: str | None = None) -> bool:
        provide_info = ProviderHelper.get_provider(provider)
        if not provide_info:
            raise HTTPException(status_code=404, detail=f"Provider {provider} not found")

        chat_passed, embd_passed, rerank_passed = False, False, False
        extra = {"provider": provider}
        msg = ""
        for llm in provide_info["llm"]:
            model_name = llm["llm_name"]
            model_type = llm["model_type"]
            if not embd_passed and model_type == LLMType.EMBEDDING.value:
                pass
            elif not chat_passed and model_type == LLMType.CHAT.value:
                assert provider in ChatModel, f"Chat model from {provider} is not supported yet."
                model = ChatModel[provider](api_key, model_name, base_url, **extra)
                try:
                    m, tc = model.chat(
                        None,
                        [{"role": "user", "content": "Hello! How are you doing!"}],
                        {"temperature": 0.9, "max_tokens": 50},
                    )
                    if m.find("**ERROR**") >= 0:
                        raise Exception(m)
                    chat_passed = True
                except Exception as e:
                    msg = f"\nFail to access model({provider}/{model_name}) using this api key." + str(e)
            elif not rerank_passed and model_type == LLMType.RERANK.value:
                pass
            if any([embd_passed, chat_passed, rerank_passed]):
                msg = ""
                break
            if msg:
                raise HTTPException(status_code=403, detail=f"{msg}")

        return True
