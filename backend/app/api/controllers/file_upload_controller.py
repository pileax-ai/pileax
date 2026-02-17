from typing import Any

from fastapi import UploadFile

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace
from app.api.models.file_meta import FileMeta, FileMetaCreate, FileMetaUpdate
from app.libs.file_uploader import FileUploader


class FileUploadController(BaseController[FileMeta, FileMetaCreate, FileMetaUpdate]):
    def __init__(self, session, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(FileMeta, session, user, workspace)

    async def upload(self, file: UploadFile) -> Any:
        file_meta = await FileUploader(date=True).upload(file)
        return self.save(FileMetaCreate(**file_meta))
