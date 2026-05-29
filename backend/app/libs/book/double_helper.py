import logging
from typing import Any

import httpx
from fastapi import HTTPException

from app.configs import app_config
from app.libs.file_uploader import FileUploader

logger = logging.getLogger(__name__)

BASE_URL = "https://api.douban.com/v2/book"
HEADERS = {
    "Accept": "application/json",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "Cache-Control": "no-cache",
    "Cookie": "",
    "Pragma": "no-cache",
    "Priority": "u=0, i",
    "Sec-Ch-Ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0",
}


class DoubanHelper:
    """
    Douban Book Api Helper
    @see https://github.com/yoyooyooo/douban-mcp
    """

    @staticmethod
    def parse_book(raw_data: dict[str, Any]) -> dict[str, Any]:
        """
        Build book dict from raw data
        """
        author_list = raw_data.get("author", [])
        return {
            "title": raw_data.get("title"),
            "subtitle": raw_data.get("subtitle"),
            "author": ",".join(author_list) if isinstance(author_list, list) else str(author_list),
            "isbn": raw_data.get("isbn13") or raw_data.get("isbn10"),
            "rating": raw_data.get("rating", {}).get("average"),
            "cover_url": raw_data.get("images", {}).get("large"),
            "ref_url": raw_data.get("alt"),
            "description": raw_data.get("summary"),
            "publisher": raw_data.get("publisher"),
            "published": raw_data.get("pubdate"),
        }

    @staticmethod
    async def search_by_keyword(keyword: str, page: int = 1, page_size: int = 10) -> list[dict[str, Any]]:
        url = f"{BASE_URL}/search"
        params = {
            "q": keyword,
            "count": page_size,
            "start": (page - 1) * page_size,
            "apikey": app_config.DOUBAN_API_KEY,
        }

        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.get(url, params=params)
                # Check status code
                response.raise_for_status()
                data = response.json()

                books = data.get("books", [])
                return [DoubanHelper.parse_book(book) for book in books]
            except Exception as e:
                logger.warning("Douban search error: %s %s", q, e)
                return []

    @staticmethod
    async def search_by_isbn(isbn: str) -> list[dict[str, Any]]:
        url = f"{BASE_URL}/isbn/{isbn}"
        params = {"apikey": app_config.DOUBAN_API_KEY}

        async with httpx.AsyncClient(headers=HEADERS) as client:
            try:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

                if data.get("id"):
                    return [DoubanHelper.parse_book(data)]
                return []
            except Exception as e:
                logger.warning("Douban search isbn error: %s %s", isbn, e)
                return []

    @staticmethod
    async def download_image(image_url: str) -> dict | None:
        if "doubanio.com" not in image_url:
            raise HTTPException(status_code=403, detail="Domain not allowed")

        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Referer": "https://www.douban.com/",
        }

        return await FileUploader(date=True).download_image(url=image_url, headers=headers)
