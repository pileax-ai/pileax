from app.api.models.provider_credential import ProviderCredential, ProviderCredentialCreate
from app.api.repos.provider_credential_repository import ProviderCredentialRepository
from app.api.services.base_service import BaseService


class ProviderCredentialService(BaseService[ProviderCredential]):
    def __init__(self, session):
        super().__init__(ProviderCredential, session, ProviderCredentialRepository)

