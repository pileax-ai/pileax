import pytest

from app.libs.book.google_book_helper import GoogleBookHelper


@pytest.mark.asyncio
async def test_search_by_keyword() -> None:
    q = "Little Prince"
    books = await GoogleBookHelper.search_by_keyword(q)
    print(f"books: {books}")


@pytest.mark.asyncio
async def test_search_by_isbn() -> None:
    isbn = "9787539957173"
    books = await GoogleBookHelper.search_by_isbn(isbn)
    print(f"books: {books}")


@pytest.mark.asyncio
async def test_download_image() -> None:
    image_url = "http://books.google.com/books/content?id=DFBADwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    image = await GoogleBookHelper.download_image(image_url)
    print(f"image: {image}")
