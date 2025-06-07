from app.api.models.user_book import UserBook
from app.api.repos.base_repository import BaseRepository


class UserBookRepository(BaseRepository[UserBook]):
    def __init__(self, model, session):
        super().__init__(model, session)
