from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspaceId
from app.api.models.file_meta import FileMeta, FileMetaCreate, FileMetaUpdate

class FileMetaController(BaseController[FileMeta, FileMetaCreate, FileMetaUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace_id: CurrentWorkspaceId
    ):
        super().__init__(FileMeta, session, workspace_id, user_id)
