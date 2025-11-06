from app.api.controllers.base_controller import BaseController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.file_meta import FileMeta, FileMetaCreate, FileMetaUpdate

class FileMetaController(BaseController[FileMeta, FileMetaCreate, FileMetaUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(FileMeta, session, tenant_id, user_id)
