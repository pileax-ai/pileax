import pytest

from app.libs.book.book_helper import BookHelper


@pytest.mark.asyncio
async def test_parse_isbn_info() -> None:
    isbn = "9787115413581"
    isbn_info = BookHelper.parse_isbn_info(isbn)
    print(f"ISBN info: {isbn_info}")
