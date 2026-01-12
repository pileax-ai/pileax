from app.api.models.app import App
from app.api.repos.base_repository import BaseRepository


class AppRepository(BaseRepository[App]):
    def __init__(self, model, session):
        super().__init__(model, session)
