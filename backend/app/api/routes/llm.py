import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.llm_controller import LLMController
from app.api.models.llm import LLMCreate, LLMPublic, LLMUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.router import ApiRouter

router = ApiRouter(prefix="/ai/llm/model", tags=["LLM"])


@router.api_post("", response_model=LLMPublic)
async def save(item_in: LLMCreate, controller: LLMController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=LLMPublic)
async def get(id: uuid.UUID, controller: LLMController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=LLMPublic)
async def update(item_in: LLMUpdate, controller: LLMController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
async def delete(id: uuid.UUID, controller: LLMController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[LLMPublic])
async def query(query: PaginationQuery, controller: LLMController = Depends()) -> Any:
    return controller.query(query)
