import logging
import shutil
from pathlib import Path

from app.configs import app_config

logger = logging.getLogger(__name__)


class BookManager:
    def __init__(self, path: str):
        self.book_dir = Path(f"{app_config.PUBLIC_FILE_ROOT}/{path}")

    def delete_book_dir(self) -> bool:
        """
        Recursively delete the book directory and all its contents.
        Returns:
            bool: True if deleted, False if directory did not exist.
        Raises:
            OSError: If the deletion fails due to permissions or file locks.
        """
        if not self.book_dir.exists():
            # Directory already gone or never existed
            return False

        if not self.book_dir.is_dir():
            # Safety check: do not delete if it's a file instead of a directory
            raise ValueError(f"Path {self.book_dir} is not a directory.")

        try:
            # shutil.rmtree is required for non-empty directories
            shutil.rmtree(self.book_dir)
            return True
        except Exception as e:
            # Log the error with context
            logger.warning("Error deleting book directory %s: %s", self.book_dir, e)
            raise
