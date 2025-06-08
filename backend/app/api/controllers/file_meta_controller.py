from typing import Optional

from app.api.controllers.base_controller import BaseController
from app.api.models.file_meta import FileMeta, FileMetaCreate, FileMetaUpdate

class FileMetaController(BaseController[FileMeta, FileMetaCreate, FileMetaUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(FileMeta, session, user_id)
