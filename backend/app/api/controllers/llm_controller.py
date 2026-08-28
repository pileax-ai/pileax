from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.llm import LLM, LLMCreate, LLMUpdate
from app.api.services.llm_service import LLMService


class LLMController(BaseController[LLM, LLMCreate, LLMUpdate]):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(LLM, session, user, workspace)
        self.service = LLMService(session)
