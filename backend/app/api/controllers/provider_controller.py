from typing import List, Any
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.provider import Provider, ProviderCreate, ProviderUpdate
from app.api.services.provider_credential_service import ProviderCredentialService
from app.api.services.provider_service import ProviderService


class ProviderController(BaseController[Provider, ProviderCreate, ProviderUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        self.user_id = user_id
        self.tenant_id = tenant_id
        self.service = ProviderService(session)
        self.credential_service = ProviderCredentialService(session)

    def delete(self, id: UUID) -> Any:
        return self.service.delete_provider(id, self.tenant_id, self.user_id)

    def find_all(self) -> List[Provider]:
        return self.service.find_all_provider(self.tenant_id)

    def find_all_model(self):
        return self.service.find_all_model(self.tenant_id)
