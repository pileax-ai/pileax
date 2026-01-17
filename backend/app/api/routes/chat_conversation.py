import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.chat_conversation_controller import ChatConversationController
from app.api.models.conversation import ConversationCreate, ConversationPublic, ConversationUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.router import ApiRouter

router = ApiRouter(prefix="/chat/conversation", tags=["Conversation"])


@router.api_post("", response_model=ConversationPublic)
async def save(item_in: ConversationCreate, controller: ChatConversationController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=ConversationPublic)
async def get(id: uuid.UUID, controller: ChatConversationController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=ConversationPublic)
async def update(item_in: ConversationUpdate, controller: ChatConversationController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
async def delete(id: uuid.UUID, controller: ChatConversationController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[ConversationPublic])
async def query(query: PaginationQuery, controller: ChatConversationController = Depends()) -> Any:
    return controller.query(query, filter_by_user=True)
