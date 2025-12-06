from app.api.models.conversation import Conversation, ConversationCreate
from app.api.models.tenant_default_model import TenantDefaultModel
from app.api.repos.conversation_repository import ConversationRepository
from app.api.repos.tenent_default_model_repository import TenantDefaultModelRepository
from app.api.services.app_service import AppService
from app.api.services.base_service import BaseService


class ConversationService(BaseService[Conversation]):
    def __init__(self, session, workspace, user_id):
        super().__init__(Conversation, session, ConversationRepository)
        self.workspace = workspace
        self.user_id = user_id
        self.app_service = AppService(session, self.workspace.tenant_id, self.user_id)
        self.tdm_repository = TenantDefaultModelRepository(TenantDefaultModel, session)

    def save(self, item_in: ConversationCreate) -> Conversation:
        # default app
        if item_in.app_id is None:
            app = self.app_service.create_default_app(item_in.model_type)
            item_in.app_id = app.id

        # default model
        # todo
        tdm_credential = self.tdm_repository.get_default_model_credential(self.workspace.tenant_id, item_in.model_type)
        if tdm_credential:
            item_in.model_provider = tdm_credential.provider
            item_in.model_name = tdm_credential.model_name

        item = item_in.model_dump(by_alias=True)
        item['workspaceId'] = self.workspace.id

        return super().save(Conversation(**item))
