from app.api.models.workspace_llm import WorkspaceLLM, WorkspaceLLMCreate
from app.api.repos.workspace_llm_repository import WorkspaceLLMRepository
from app.api.services.base_service import BaseService


class WorkspaceLLMService(BaseService[WorkspaceLLM]):
    def __init__(self, session, workspace):
        super().__init__(WorkspaceLLM, session, WorkspaceLLMRepository)
        self.workspace = workspace

    def save(self, item_in: WorkspaceLLMCreate) -> WorkspaceLLM:
        item = item_in.model_dump(by_alias=True)
        item["workspace_id"] = self.workspace.id
        return super().save(WorkspaceLLM(**item))
