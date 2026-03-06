from app.api.models.provider_credential import Credential, ProviderCredential
from app.api.models.workspace import Workspace
from app.api.repos.provider_credential_repository import ProviderCredentialRepository
from app.api.services.base_service import BaseService
from app.api.services.tenant_service import TenantService
from app.libs.crypto.encryptor import decrypt, encrypt
from app.libs.crypto.key_manager import load_private_key_cached


class ProviderCredentialService(BaseService[ProviderCredential]):
    def __init__(self, session):
        super().__init__(ProviderCredential, session, ProviderCredentialRepository)
        self.tenant_service = TenantService(session)

    def encrypt(self, credential: Credential, workspace: Workspace) -> Credential:
        api_key = credential.api_key
        if api_key is None:
            return credential
        public_key = self.tenant_service.get_public_key(workspace.tenant_id)
        credential.api_key = encrypt(api_key, public_key)

        return credential

    def decrypt(self, credential: Credential, workspace: Workspace) -> Credential:
        api_key = credential.api_key

        # plain api-key
        if api_key is None or api_key.startswith("sk"):
            return credential

        private_key = load_private_key_cached(str(workspace.tenant_id))
        credential.api_key = decrypt(api_key, private_key)

        return credential

    def encrypt_api_key(self, api_key: str, workspace: Workspace) -> str | None:
        if api_key is None:
            return api_key
        public_key = self.tenant_service.get_public_key(workspace.tenant_id)
        return encrypt(api_key, public_key)

    def decrypt_api_key(self, api_key: str, workspace: Workspace) -> str:
        # plain api-key
        if api_key is None or api_key.startswith("sk"):
            return api_key

        private_key = load_private_key_cached(str(workspace.tenant_id))
        return decrypt(api_key, private_key)

    def mask_api_key(self, api_key: str) -> str:
        """
        Mask API Key: keeps 'sk' and last 4 characters.
        Format: sk-********xxxx
        """
        if not api_key or len(api_key) < 8:
            return "invalid-key"

        # Keeps 'sk', masks the middle, keeps last 4 characters
        # Usually OpenAI keys start with 'sk-', so we handle both 'sk' and 'sk-'
        prefix = "sk-" if api_key.startswith("sk-") else api_key[:3]
        suffix = api_key[-4:]

        return f"{prefix}********{suffix}"
