from typing import Any

from fastapi import UploadFile

from app.api.controllers.file_upload_controller import FileUploadController
from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUserId
from app.api.models.file_meta import FileMetaPublic

router = ApiRouter(prefix="/file/upload", tags=["FileUpload"])


@router.api_post("", response_model=FileMetaPublic)
async def upload(file: UploadFile, session: SessionDep, user_id: CurrentUserId) -> Any:
    return await FileUploadController(session, user_id).upload(file)
