import logging
from typing import Any

from stdnum import isbn

from app.libs.book.double_helper import DoubanHelper
from app.libs.book.google_book_helper import GoogleBookHelper

logger = logging.getLogger(__name__)

ISBN_REGION_MAP = {
    "0": "English",
    "1": "English",
    "2": "French",
    "3": "German",
    "4": "Japan",
    "5": "Russian",
    "7": "China",
    "88": "Italy",
    "91": "Sweden",
    "957": "Taiwan",
    "962": "Hong Kong",
    "981": "Singapore",
    "986": "Taiwan",
    "988": "Hong Kong",
}


class BookHelper:
    @staticmethod
    def build_book_path(sha1: str):
        """
        Two-Level Hashed Directory Tree
        1. Performance & Scalability (O(1) Access)
        2. Predictable & Permanent URLs
        3. Storage Load Balancing
        :param sha1: Book SHA-1 Hash
        :return:
        """
        l1 = sha1[0:2]
        l2 = sha1[2:4]
        return f"book/{l1}/{l2}/{sha1}"

    @staticmethod
    def is_isbn(isbn_str: str) -> bool:
        return isbn.is_valid(isbn_str)

    @staticmethod
    def parse_isbn_info(isbn_str: str):
        if not isbn.is_valid(isbn_str):
            return None

        try:
            parts = isbn.split(isbn_str)
            group_id = parts[1]
            region_name = ISBN_REGION_MAP.get(group_id, f"Region {group_id}")

            return {"group_id": group_id, "region": region_name}
        except Exception as e:
            logger.warning("Parse isbn error: %s %s", isbn_str, e)
            return None

    @staticmethod
    async def fetch_book_by_isbn(isbn_str: str) -> list[dict[str, Any]]:
        isbn_info = BookHelper.parse_isbn_info(isbn_str)
        if not isbn_info:
            return []

        region = isbn_info["region"]
        if region in {"China", "Hong Kong", "Taiwan"}:
            return await DoubanHelper.search_by_isbn(isbn_str)
        else:
            return await GoogleBookHelper.search_by_isbn(isbn_str)

    @staticmethod
    async def download_image(image_url: str) -> dict | None:
        if not image_url:
            return None

        if "doubanio.com" in image_url:
            return await DoubanHelper.download_image(image_url)

        google_allowed_domains = ["books.google.com", "googleusercontent.com", "gstatic.com"]
        if any(domain in image_url for domain in google_allowed_domains):
            return await GoogleBookHelper.download_image(image_url)

        return None
