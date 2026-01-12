from app.api.models.conversation import Conversation
from app.api.repos.base_repository import BaseRepository


class ConversationRepository(BaseRepository[Conversation]):
    def __init__(self, model, session):
        super().__init__(model, session)
