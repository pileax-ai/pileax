import shutil
from pathlib import Path
from typing import Union

from fastapi import UploadFile

from app.api.models.book import BookCreate
from app.configs import app_config
from app.libs.file_helper import FileHelper

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
        "cbz",
        "fb2",
        "fbz",
        "pdf",
    ],
}


class BookUploader:
    def __init__(self, meta: BookCreate):
        self.book_dir = Path(f"{app_config.PUBLIC_FILE_ROOT}/{meta.path}")
        self.book_dir.mkdir(parents=True, exist_ok=True)
        self.meta = meta

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

        # Create a text file
        if file_name.startswith("book"):
            json_filename = f"{FileHelper.get_safe_name(self.meta.title)}.json"
            json_path = self.book_dir / json_filename
            meta_json = self.meta.model_dump_json(
                indent=2,
                exclude={"tenant_id", "file_name", "cover_name", "path"}
            )
            with json_path.open("w", encoding="utf-8") as f:
                f.write(meta_json)

        return {
            "original_name": original_name,
            "file_name": file_name,
            "mimetype": file.content_type,
            "path": f"/{self.meta.path}/{file_name}",
            "size": file.size,
            "ref_type": "book",
            "ref_id": str(self.meta.id),
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
