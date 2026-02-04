from typing import Any

from fastapi import Depends

from app.api.controllers.llm_controller import LLMController
from app.api.models.provider import ProviderInfo
from app.api.router import ApiRouter

router = ApiRouter(prefix="/llm", tags=["LLM"])


@router.api_get("/providers", response_model=list[ProviderInfo])
async def get_providers(controller: LLMController = Depends()) -> Any:
    return controller.get_providers()


@router.api_get("/provider", response_model=ProviderInfo)
async def get_provider(id: str, controller: LLMController = Depends()) -> Any:
    return controller.get_provider(id)
