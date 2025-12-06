from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspace
from app.api.models.conversation import Conversation, ConversationCreate, ConversationUpdate
from app.api.services.conversation_service import ConversationService
from app.constants.enums import LLMType


class ChatConversationController(BaseController[Conversation, ConversationCreate, ConversationUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace: CurrentWorkspace
    ):
        super().__init__(Conversation, session, workspace.id, user_id)
        self.service = ConversationService(session, workspace, user_id)


    def save(self, item_in: ConversationCreate) -> Conversation:
        item_in.model_type = LLMType.CHAT
        return self.service.save(item_in)
