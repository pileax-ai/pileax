from typing import List
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspaceId
from app.api.models.message import Message, MessageCreate, MessageUpdate
from app.api.services.chat_service import ChatService


class ChatController(BaseController[Message, MessageCreate, MessageUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId
    ):
        super().__init__(Message, session, workspace_id, user_id)
        self.service = ChatService(session, workspace_id, user_id)


    def completions(self, item_in: MessageCreate) -> Message:
        return self.service.completions(item_in)

    def find_by_conversation(self, conversation_id: UUID) -> List[Message]:
        return self.service.find_by_conversation(conversation_id)
