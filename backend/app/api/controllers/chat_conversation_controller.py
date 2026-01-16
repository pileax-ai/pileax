from typing import Any
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspace, SessionDep
from app.api.models.conversation import Conversation, ConversationCreate, ConversationUpdate
from app.api.services.chat_service import ChatService
from app.api.services.conversation_service import ConversationService
from app.constants.enums import LLMType


class ChatConversationController(BaseController[Conversation, ConversationCreate, ConversationUpdate]):
    def __init__(self, session: SessionDep, user_id: CurrentUserId, workspace: CurrentWorkspace):
        super().__init__(Conversation, session, user_id, workspace.id)
        self.service = ConversationService(session, user_id, workspace)
        self.chat_service = ChatService(session, user_id, workspace)

    def save(self, item_in: ConversationCreate) -> Conversation:
        item_in.model_type = LLMType.CHAT
        return self.service.save(item_in)

    def delete(self, id: UUID) -> Any:
        super().delete(id)

        # delete related message
        self.chat_service.delete_all({"conversation_id": id})
