from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.workspace_llm import WorkspaceLLM, WorkspaceLLMCreate, WorkspaceLLMUpdate
from app.api.services.workspace_llm_service import WorkspaceLLMService


class WorkspaceLLMController(BaseController[WorkspaceLLM, WorkspaceLLMCreate, WorkspaceLLMUpdate]):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(WorkspaceLLM, session, user, workspace)
        self.service = WorkspaceLLMService(session)
