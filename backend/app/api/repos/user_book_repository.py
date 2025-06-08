from sqlalchemy import func
from sqlmodel import select
from uuid import UUID

from app.api.models.book import Book
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user_book import UserBook
from app.api.repos.base_repository import BaseRepository
from app.utils.db_util import DbUtil


class UserBookRepository(BaseRepository[UserBook]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(UserBook, Book)
            .join(Book, Book.id == UserBook.book_id)
            .where(UserBook.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            user_book, book = result
            return self._build_details(user_book, book)
        return None

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        user_book_filters = DbUtil.get_filters(UserBook, query.condition, ['user_id'])
        book_filters = DbUtil.get_filters(Book, query.condition, ['title'])
        filters = user_book_filters + book_filters

        # 2. stmt
        stmt = (
            select(UserBook, Book)
            .join(Book, Book.id == UserBook.book_id)
        )
        count_stmt = (
            select(func.count())
            .select_from(UserBook)
            .join(Book, Book.id == UserBook.book_id)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        for field, direction in query.sort.items():
            if hasattr(UserBook, field):
                column = getattr(UserBook, field)
            elif hasattr(Book, field):
                column = getattr(Book, field)
            else:
                continue
            stmt = stmt.order_by(column.desc() if direction == "desc" else column.asc())

        # 4. Pagination
        offset = (query.pageIndex - 1) * query.pageSize
        stmt = stmt.offset(offset).limit(query.pageSize)

        # 5. Query
        # 5.1 Total
        total = self.session.exec(count_stmt).one()

        # 5.2 Rows
        result = self.session.exec(stmt)
        pairs = result.all()
        rows = [
            self._build_details(user_book, book)
            for user_book, book in pairs
        ]
        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def _build_details(self, user_book: UserBook, book: Book) -> dict:
        return {
                **user_book.model_dump(),
                "owner": book.user_id,
                "title": book.title,
                "path": book.path,
                "file_name": book.file_name,
                "cover_name": book.cover_name,
                "author": book.author,
                "language": book.language,
                "description": book.description,
                "publisher": book.publisher,
                "published": book.published,
                "scope": book.scope,
                "book_rating": book.rating,
            }
