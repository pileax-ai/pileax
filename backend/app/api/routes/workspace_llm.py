import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.workspace_llm_controller import WorkspaceLLMController
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_llm import WorkspaceLLMCreate, WorkspaceLLMPublic, WorkspaceLLMUpdate
from app.api.router import ApiRouter

router = ApiRouter(prefix="/workspace/ai/llm/model", tags=["WorkspaceLLM"])


@router.api_post("", response_model=WorkspaceLLMPublic)
async def save(item_in: WorkspaceLLMCreate, controller: WorkspaceLLMController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=WorkspaceLLMPublic)
async def get(id: uuid.UUID, controller: WorkspaceLLMController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=WorkspaceLLMPublic)
async def update(item_in: WorkspaceLLMUpdate, controller: WorkspaceLLMController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
async def delete(id: uuid.UUID, controller: WorkspaceLLMController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[WorkspaceLLMPublic])
async def query(query: PaginationQuery, controller: WorkspaceLLMController = Depends()) -> Any:
    return controller.query(query)
