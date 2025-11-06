import shutil
import uuid
from pathlib import Path
from fastapi import UploadFile
from datetime import datetime

from app.core.config import settings


class FileUploader:
    def __init__(self, directory: str = "file", date: bool = False):
        if date:
            today = datetime.today().strftime("%Y%m%d")
            self.base_dir = str(Path(directory) / today)
        else:
            self.base_dir = directory

    async def upload(self, file: UploadFile):
        upload_dir = Path(f"{settings.PUBLIC_ROOT}/{self.base_dir}")
        upload_dir.mkdir(parents=True, exist_ok=True)
        original_name = file.filename

        file_name = self._get_safe_filename(original_name)
        path = upload_dir / file_name
        with path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {
            "original_name": original_name,
            "file_name": file_name,
            "mimetype": file.content_type,
            "path": f"/{self.base_dir}/{file_name}",
            "size": file.size,
        }

    def _get_safe_filename(self, filename: str) -> str:
        ext = Path(filename).suffix
        return f"{uuid.uuid4().hex}{ext}"
