from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspace, SessionDep
from app.api.models.message import Message, MessageCreate, MessageUpdate
from app.api.services.chat_service import ChatService


class ChatController(BaseController[Message, MessageCreate, MessageUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace: CurrentWorkspace
    ):
        super().__init__(Message, session, user_id, workspace.id, workspace)
        self.service = ChatService(session, user_id, workspace)

    def completions(self, item_in: MessageCreate) -> Message:
        return self.service.completions(item_in)

    def find_by_conversation(self, conversation_id: UUID) -> list[Message]:
        return self.service.find_by_conversation(conversation_id)
