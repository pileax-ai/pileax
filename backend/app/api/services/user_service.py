from uuid import UUID

from app.api.models.user import User
from app.api.repos.user_repository import UserRepository
from app.api.services.base_service import BaseService

class UserService(BaseService[User]):
    def __init__(self, session):
        super().__init__(User, session, UserRepository)

    def update_avatar(self, user_id: UUID, avatar_url: str):
        user = self.get(user_id)
        return self.repo.update(user, {"avatar": avatar_url})
