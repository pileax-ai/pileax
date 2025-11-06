from typing import Optional, Any
from fastapi import UploadFile

from app.api.controllers.base_controller import BaseController
from app.api.models.file_meta import FileMeta, FileMetaCreate, FileMetaUpdate
from app.libs.file_uploader import FileUploader


class FileUploadController(BaseController[FileMeta, FileMetaCreate, FileMetaUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(FileMeta, session, user_id)

    async def upload(self, file: UploadFile) -> Any:
        file_meta = await FileUploader(date=True).upload(file)
        return self.save(FileMetaCreate(**file_meta))
