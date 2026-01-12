import shutil
from pathlib import Path
from typing import Union

from fastapi import UploadFile

from app.configs import app_config

FileAllowedTypes = {
    "file": [
        "image",
        "application",
        "text",
    ],
    "image": [
        "image",
        "application/octet-stream",
    ],
    "book": [
        "ebook",
        "azw3",
        "epub",
        "mobi",
        "fb2",
        "cbz",
        "pdf",
    ],
}


class BookUploader:
    def __init__(self, id: str, sha1: str):
        self.book_path = f"book/{sha1}"
        self.book_dir = Path(f"{app_config.PUBLIC_FILE_ROOT}/{self.book_path}")
        self.book_dir.mkdir(parents=True, exist_ok=True)
        self.fileName = id
        self.id = id

    async def upload(self, files: list[UploadFile]):
        results = []
        for file in files:
            result = await self.upload_file(file)
            results.append(result)
        return results

    async def upload_file(self, file: UploadFile):
        original_name = file.filename
        file_name = self._get_filename(file)
        path = self.book_dir / file_name

        # Save
        with path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {
            "original_name": original_name,
            "file_name": file_name,
            "mimetype": file.content_type,
            "path": f"/{self.book_path}/{file_name}",
            "size": file.size,
            "ref_type": "book",
            "ref_id": self.id,
        }

    def _get_filename(self, file: UploadFile) -> str:
        name = "book" if self.is_book(file) else "cover"
        ext = Path(file.filename).suffix
        return f"{name}{ext}"

    def is_book(self, file: Union[str, UploadFile], mimetype: str | None = None) -> bool:
        """
        file: 可以是 UploadFile 或文件名字符串
        mimetype: 如果 file 不是 UploadFile，则需要传 mimetype
        """
        if hasattr(file, "filename"):
            filename = file.filename
            mimetype = file.content_type
        else:
            filename = file

        extname = Path(filename).suffix.lower().replace(".", "")

        return any(mimetype and e in mimetype or e in extname for e in FileAllowedTypes["book"])
