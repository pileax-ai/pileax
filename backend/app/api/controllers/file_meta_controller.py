from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.file_meta import FileMeta, FileMetaCreate, FileMetaUpdate
from app.api.services.file_meta_service import FileMetaService


class FileMetaController(BaseController[FileMeta, FileMetaCreate, FileMetaUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user: CurrentUser,
        workspace: CurrentWorkspace,
    ):
        super().__init__(FileMeta, session, user, workspace)
        self.service = FileMetaService(session)

    def get_by_sha1(self, sha1: str) -> FileMeta:
        return self.service.get_by_sha1(sha1)
