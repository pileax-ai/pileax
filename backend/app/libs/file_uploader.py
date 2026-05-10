import mimetypes
import shutil
import uuid
from datetime import datetime
from pathlib import Path

import httpx
from fastapi import HTTPException, UploadFile
from httpx import URL
from httpx._types import HeaderTypes, ProxyTypes

from app.configs import app_config


class FileUploader:
    def __init__(self, directory: str = "file", date: bool = False):
        if date:
            today = datetime.today().strftime("%Y%m%d")
            self.base_dir = str(Path(directory) / today)
        else:
            self.base_dir = directory

    async def upload(self, file: UploadFile):
        upload_dir = Path(f"{app_config.PUBLIC_FILE_ROOT}/{self.base_dir}")
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
            "url": f"/{self.base_dir}/{file_name}",
            "size": file.size,
        }

    async def download_image(self, url: URL | str, headers: HeaderTypes | None = None, proxy: ProxyTypes | None = None):
        # path
        upload_dir = Path(f"{app_config.PUBLIC_FILE_ROOT}/{self.base_dir}")
        upload_dir.mkdir(parents=True, exist_ok=True)

        # download
        async with httpx.AsyncClient(follow_redirects=True, headers=headers, proxy=proxy) as client:
            try:
                async with client.stream("GET", url, timeout=10.0) as response:
                    if response.status_code != 200:
                        raise HTTPException(
                            status_code=response.status_code, detail="Failed to fetch image from source"
                        )

                    # Metadata
                    content_type = response.headers.get("Content-Type", "image/jpeg")
                    content_length = int(response.headers.get("Content-Length", 0))

                    # File name
                    ext = mimetypes.guess_extension(content_type) or ".jpg"
                    file_name = f"{uuid.uuid4().hex}{ext}"
                    path = upload_dir / file_name

                    actual_size = 0
                    with open(path, "wb") as f:
                        async for chunk in response.aiter_bytes():
                            f.write(chunk)
                            actual_size += len(chunk)

                    return {
                        "original_name": url,
                        "file_name": file_name,
                        "mimetype": content_type,
                        "url": f"/{self.base_dir}/{file_name}",
                        "size": actual_size or content_length,
                    }

            except httpx.TimeoutException:
                raise HTTPException(status_code=504, detail="Source server timeout")
            except Exception as e:
                if "path" in locals() and path.exists():
                    path.unlink()
                raise HTTPException(status_code=500, detail=f"Download error: {str(e)}")

    def _get_safe_filename(self, filename: str) -> str:
        ext = Path(filename).suffix
        return f"{uuid.uuid4().hex}{ext}"
