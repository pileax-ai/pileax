import json
from typing import Any

from fastapi import UploadFile

from app.api.controllers.base_controller import BaseController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.base import RefModel
from app.api.models.file_meta import FileMeta, FileMetaCreate, FileMetaUpdate
from app.libs.file_uploader import FileUploader


class FileUploadController(BaseController[FileMeta, FileMetaCreate, FileMetaUpdate]):
    def __init__(self, session: SessionDep, user: CurrentUser, workspace: CurrentWorkspace):
        super().__init__(FileMeta, session, user, workspace)

    async def upload(self, file: UploadFile, meta: str) -> Any:
        ref_meta = RefModel(**json.loads(meta))
        file_meta = await FileUploader(date=True).upload(file)
        file_meta["ref_id"] = ref_meta.ref_id
        file_meta["ref_type"] = ref_meta.ref_type
        return self.save(FileMetaCreate(**file_meta))
