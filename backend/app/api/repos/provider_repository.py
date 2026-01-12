from app.api.models.provider import Provider
from app.api.repos.base_repository import BaseRepository


class ProviderRepository(BaseRepository[Provider]):
    def __init__(self, model, session):
        super().__init__(model, session)
