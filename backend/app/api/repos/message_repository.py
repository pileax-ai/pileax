from app.api.models.message import Message
from app.api.repos.base_repository import BaseRepository


class MessageRepository(BaseRepository[Message]):
    def __init__(self, model, session):
        super().__init__(model, session)
