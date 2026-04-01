import hashlib
import re

from fastapi import UploadFile


class FileHelper:
    @staticmethod
    def get_safe_name(name: str) -> str:
        r"""
        Sanitize the name to be used as a safe filename.
        Removes invalid characters: \ / : * ? " < > |
        """
        # 1. Replace invalid characters with an underscore
        # This covers most OS restrictions and URL-unsafe chars
        safe_name = re.sub(r'[\\/*?:"<>|]', "_", name)

        # 2. Trim whitespace and prevent leading/trailing dots (issues on Windows)
        safe_name = safe_name.strip().strip(".")

        # 3. Optional: Limit length to 200 chars (standard is 255, but leave room for path)
        return safe_name[:200] if safe_name else "unknown"

    @staticmethod
    async def get_uploadfile_sha1(file: UploadFile) -> str:
        sha1 = hashlib.sha1()

        # Ensure we are reading from the very beginning
        # In case the file was partially read elsewhere
        await file.seek(0)

        # Read the content directly using the async method
        content = await file.read()
        sha1.update(content)

        # Crucial: reset cursor so the file can be saved/read again
        await file.seek(0)

        return sha1.hexdigest()
