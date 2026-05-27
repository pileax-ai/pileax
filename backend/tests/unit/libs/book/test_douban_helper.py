import pytest

from app.libs.book.double_helper import DoubanHelper


@pytest.mark.asyncio
async def test_search_by_keyword() -> None:
    q = "9787115413581"
    books = await DoubanHelper.search_by_keyword(q)
    print(f"books: {books}")


@pytest.mark.asyncio
async def test_search_by_isbn() -> None:
    # isbn = "9787115413581"
    isbn = "9787553824291"
    books = await DoubanHelper.search_by_isbn(isbn)
    print(f"books: {books}")


@pytest.mark.asyncio
async def test_download_image() -> None:
    image_url = "https://img3.doubanio.com/view/subject/l/public/s33497863.jpg"
    image = await DoubanHelper.download_image(image_url)
    print(f"image: {image}")
