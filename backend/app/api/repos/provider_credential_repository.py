from app.api.models.provider_credential import ProviderCredential
from app.api.repos.base_repository import BaseRepository


class ProviderCredentialRepository(BaseRepository[ProviderCredential]):
    def __init__(self, model, session):
        super().__init__(model, session)
