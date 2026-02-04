from app.api.models.workspace_llm import WorkspaceLLM
from app.api.repos.base_repository import BaseRepository


class WorkspaceLLMRepository(BaseRepository[WorkspaceLLM]):
    def __init__(self, model, session):
        super().__init__(model, session)
