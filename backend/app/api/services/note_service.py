from uuid import UUID

from app.api.models.note import Note
from app.api.models.query import PaginationQuery, QueryResult
from app.api.repos.note_repository import NoteRepository
from app.api.services.base_service import BaseService


class NoteService(BaseService[Note]):
    def __init__(self, session):
        super().__init__(Note, session, NoteRepository)

    def find_all_by_workspace(self, user_id: UUID, workspace_id: UUID) -> list:
        return self.repo.find_all_by_workspace(user_id, workspace_id)

    def query_my(self, query: PaginationQuery, user_id) -> QueryResult[Note]:
        return self.repo.query_my(query, user_id)
