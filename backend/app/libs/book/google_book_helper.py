import logging
from typing import Any

import httpx
from fastapi import HTTPException

from app.configs import app_config
from app.libs.file_uploader import FileUploader

logger = logging.getLogger(__name__)

PROXY = app_config.HTTP_PROXY
API_KEY = app_config.GOOGLE_API_KEY
BASE_URL = "https://www.googleapis.com/books/v1"
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


class GoogleBookHelper:
    """
    Google Book API Helper
    @see https://developers.google.com/books/docs/v1/getting_started
    """

    @staticmethod
    def parse_book(raw_data: dict[str, Any]) -> dict[str, Any]:
        """
        Build book dict from Google Books API raw data
        """
        volume_info = raw_data.get("volumeInfo", {})

        # 1. Author
        author_list = volume_info.get("authors", [])
        author_str = ",".join(author_list) if isinstance(author_list, list) else str(author_list)

        # 2. ISBN
        industry_ids = volume_info.get("industryIdentifiers", [])
        isbn = next((i["identifier"] for i in industry_ids if i["type"] == "ISBN_13"), None)
        if not isbn and industry_ids:
            isbn = industry_ids[0].get("identifier")

        # 3. Cover
        image_links = volume_info.get("imageLinks", {})
        cover_url = image_links.get("thumbnail") or image_links.get("smallThumbnail")
        if cover_url:
            cover_url = cover_url.replace("http://", "https://")

        return {
            "title": volume_info.get("title"),
            "author": author_str,
            "isbn": isbn,
            "cover_url": cover_url,
            "ref_url": volume_info.get("infoLink"),
            "description": volume_info.get("description"),
            "publisher": volume_info.get("publisher"),
            "published": volume_info.get("publishedDate"),
            "language": volume_info.get("language"),
        }

    @staticmethod
    async def search_by_keyword(keyword: str, page: int = 1, page_size: int = 10) -> list[dict[str, Any]]:
        url = f"{BASE_URL}/volumes"
        params = {
            "q": f"intitle:{keyword}",
            "maxResults": page_size,
            "startIndex": (page - 1) * page_size,
            "printType": "books",
            "orderBy": "relevance",
            "key": API_KEY,
        }

        async with httpx.AsyncClient(headers=HEADERS, proxy=PROXY) as client:
            try:
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()

                items = data.get("items", [])
                return [GoogleBookHelper.parse_book(item) for item in items]

            except Exception as e:
                logger.warning("Google Books search error: %s %s", q, e)
                return []

    @staticmethod
    async def search_by_isbn(isbn: str) -> list[dict[str, Any]]:
        url = f"{BASE_URL}/volumes"
        params = {"q": f"isbn:{isbn}", "maxResults": 1, "key": API_KEY}

        async with httpx.AsyncClient(headers=HEADERS, proxy=PROXY) as client:
            try:
                response = await client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()

                items = data.get("items", [])
                if not items:
                    return []

                return [GoogleBookHelper.parse_book(items[0])]
            except Exception as e:
                logger.warning("Google Books search isbn error: %s %s", isbn, e)
                return []

    @staticmethod
    async def download_image(image_url: str) -> dict | None:
        allowed_domains = ["books.google.com", "googleusercontent.com", "gstatic.com"]
        if not any(domain in image_url for domain in allowed_domains):
            raise HTTPException(status_code=403, detail="Domain not allowed")

        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        }

        return await FileUploader(date=True).download_image(url=image_url, headers=headers, proxy=PROXY)
