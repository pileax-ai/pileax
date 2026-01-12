from app.api.models.user import User
from app.api.repos.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, model, session):
        super().__init__(model, session)
