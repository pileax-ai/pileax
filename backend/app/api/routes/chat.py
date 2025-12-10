import uuid
from typing import Any, List

from fastapi import Depends

from app.api.controllers.chat_controller import ChatController
from app.api.router import ApiRouter

from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.message import MessageCreate, MessageUpdate, MessagePublic

router = ApiRouter(prefix="/chat", tags=["Chat"])


@router.api_get("", response_model=MessagePublic)
def get(id: uuid.UUID, controller: ChatController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=MessagePublic)
def update(item_in: MessageUpdate, controller: ChatController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: ChatController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[MessagePublic])
def query(query: PaginationQuery, controller: ChatController = Depends()) -> Any:
    return controller.query(query, filter_by_user=True)


@router.api_post("/completions", response_model=MessagePublic)
def completions(item_in: MessageCreate, controller: ChatController = Depends()) -> Any:
    return controller.completions(item_in)


@router.api_get("/messages", response_model=List[MessagePublic])
def find_by_conversation(conversation_id: uuid.UUID, controller: ChatController = Depends()) -> Any:
    return controller.find_by_conversation(conversation_id)
