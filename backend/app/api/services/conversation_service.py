from app.api.models.conversation import Conversation, ConversationCreate
from app.api.models.provider_default_model import ProviderDefaultModel
from app.api.repos.conversation_repository import ConversationRepository
from app.api.repos.provider_default_model_repository import ProviderDefaultModelRepository
from app.api.services.app_service import AppService
from app.api.services.base_service import BaseService


class ConversationService(BaseService[Conversation]):
    def __init__(self, session, user_id, workspace):
        super().__init__(Conversation, session, ConversationRepository)
        self.user_id = user_id
        self.workspace = workspace
        self.app_service = AppService(session, self.user_id, self.workspace)
        self.pdm_repository = ProviderDefaultModelRepository(ProviderDefaultModel, session)

    def save(self, item_in: ConversationCreate) -> Conversation:
        # default app
        if item_in.app_id is None:
            app = self.app_service.create_default_app(item_in.model_type)
            item_in.app_id = app.id

        # user specific model
        if item_in.model_provider is None and item_in.model_name is None:
            # use default model
            pdm_credential = self.pdm_repository.get_default_model_credential(self.workspace.id, item_in.model_type)
            if pdm_credential:
                item_in.model_provider = pdm_credential.provider
                item_in.model_name = pdm_credential.model_name

        item = item_in.model_dump(by_alias=True)
        item["userId"] = self.user_id
        item["workspaceId"] = self.workspace.id

        return super().save(Conversation(**item))
