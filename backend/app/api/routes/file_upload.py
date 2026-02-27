from typing import Any

from fastapi import Depends, Form, UploadFile

from app.api.controllers.file_upload_controller import FileUploadController
from app.api.models.file_meta import FileMetaPublic
from app.api.router import ApiRouter

router = ApiRouter(prefix="/file/upload", tags=["FileUpload"])


@router.api_post("", response_model=FileMetaPublic)
async def upload(file: UploadFile, meta: str = Form(...), controller: FileUploadController = Depends()) -> Any:
    return await controller.upload(file, meta)
