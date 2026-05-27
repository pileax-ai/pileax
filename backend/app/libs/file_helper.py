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
        if not name:
            return "unknown"

        # 1. Replace invalid characters with an underscore
        # This covers most OS restrictions and URL-unsafe chars
        safe_name = re.sub(r'[\x00-\x1f\\/*?:"<>|]', "_", name)

        # 2. Trim whitespace and prevent leading/trailing dots (issues on Windows)
        safe_name = safe_name.strip().strip(".")

        # 3. Handle Windows reserved names (since this is the pure base name)
        reserved_names = {
            "CON", "PRN", "AUX", "NUL",
            "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
            "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"
        }
        if safe_name.upper() in reserved_names:
            safe_name = f"_{safe_name}"

        # 4. Fallback if the name became empty or contains only underscores/dots after sanitization
        # re.sub(r'[_.]', '', safe_name) removes all underscores and dots to check if any valid character remains
        if not safe_name or not re.sub(r'[_.]', '', safe_name).strip():
            return "unknown"

        # 5. Safe truncation by BYTES (not characters)
        name_bytes = safe_name.encode("utf-8")
        if len(name_bytes) > 200:
            safe_name = name_bytes[:200].decode("utf-8", errors="ignore")

        # 6. Double check trailing dots after truncation
        safe_name = safe_name.strip(".")

        return safe_name or "unknown"

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
