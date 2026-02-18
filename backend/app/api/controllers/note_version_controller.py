from fastapi import HTTPException
from starlette import status

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.note_version import NoteVersion, NoteVersionCreate, NoteVersionUpdate
from app.api.models.query import PaginationQuery
from app.api.services.note_version_service import NoteVersionService


class NoteVersionController(BaseController[NoteVersion, NoteVersionCreate, NoteVersionUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user: CurrentUser,
        workspace: CurrentWorkspace,
    ):
        super().__init__(NoteVersion, session, user, workspace)
        self.service = NoteVersionService(session)

    def query_details(self, query: PaginationQuery):
        if query.condition.get("noteId") is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Note Id is required",
            )

        if query.condition.get("userId") is None:
            query.condition["userId"] = self.user.id
        return self.service.query_details(query)
