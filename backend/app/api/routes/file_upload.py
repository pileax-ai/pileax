from typing import Any

from fastapi import UploadFile

from app.api.controllers.file_upload_controller import FileUploadController
from app.api.deps import CurrentUserId, SessionDep
from app.api.models.file_meta import FileMetaPublic
from app.api.router import ApiRouter

router = ApiRouter(prefix="/file/upload", tags=["FileUpload"])


@router.api_post("", response_model=FileMetaPublic)
async def upload(file: UploadFile, session: SessionDep, user_id: CurrentUserId) -> Any:
    return await FileUploadController(session, user_id).upload(file)
