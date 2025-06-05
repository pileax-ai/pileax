from app.api.models.user import User
from app.api.repos.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User
