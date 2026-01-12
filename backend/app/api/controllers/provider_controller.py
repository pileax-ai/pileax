from typing import Any
from uuid import UUID

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUserId, CurrentWorkspace, SessionDep
from app.api.models.provider import Provider, ProviderCreate, ProviderUpdate
from app.api.services.provider_credential_service import ProviderCredentialService
from app.api.services.provider_service import ProviderService


class ProviderController(BaseController[Provider, ProviderCreate, ProviderUpdate]):
    def __init__(self, session: SessionDep, user_id: CurrentUserId, workspace: CurrentWorkspace):
        super().__init__(Provider, session, user_id, workspace.id)
        self.user_id = user_id
        self.workspace = workspace
        self.service = ProviderService(session)
        self.credential_service = ProviderCredentialService(session)

    def delete(self, id: UUID) -> Any:
        return self.service.delete_provider(id, self.workspace.id, self.user_id)

    def find_all(self) -> list[Provider]:
        return self.service.find_all_provider(self.workspace.id)

    def find_all_model(self):
        return self.service.find_all_model(self.workspace.id)
