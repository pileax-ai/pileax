import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.llm_provider_controller import LLMProviderController
from app.api.models.llm_provider import LLMProviderCreate, LLMProviderModels, LLMProviderPublic, LLMProviderUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.router import ApiRouter

router = ApiRouter(prefix="/ai/llm/provider", tags=["LLM Provider"])


@router.api_post("", response_model=LLMProviderPublic)
async def save(item_in: LLMProviderCreate, controller: LLMProviderController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=LLMProviderPublic)
async def get(id: uuid.UUID, controller: LLMProviderController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=LLMProviderPublic)
async def update(item_in: LLMProviderUpdate, controller: LLMProviderController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
async def delete(id: uuid.UUID, controller: LLMProviderController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[LLMProviderPublic])
async def query(query: PaginationQuery, controller: LLMProviderController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/providers", response_model=list[LLMProviderModels])
async def find_providers(controller: LLMProviderController = Depends()) -> Any:
    return controller.find_providers()


@router.api_post("/update", response_model=bool)
async def update_online(controller: LLMProviderController = Depends()) -> Any:
    return controller.update_online()
