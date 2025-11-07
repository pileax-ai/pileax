from sqlalchemy import func
from sqlmodel import select
from uuid import UUID

from app.api.models.book import Book
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant_book import TenantBook
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class TenantBookRepository(BaseRepository[TenantBook]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(TenantBook, Book)
            .join(Book, Book.id == TenantBook.book_id)
            .where(TenantBook.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            user_book, book = result
            return self.build_details(user_book, book)
        return None

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            TenantBook: ['tenant_id', 'user_id'],
            Book: ['title'],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = (select(TenantBook, Book)
            .join(Book, Book.id == TenantBook.book_id)
        )
        count_stmt = (select(func.count())
            .select_from(TenantBook)
            .join(Book, Book.id == TenantBook.book_id)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [TenantBook, Book], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = [
            self.build_details(user_book, book)
            for user_book, book in self.session.exec(stmt).all()
        ]
        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    @staticmethod
    def build_details(tenant_book: TenantBook, book: Book) -> dict:
        return {
            **tenant_book.model_dump(),
            "owner": book.user_id,
            "title": book.title,
            "path": book.path,
            "file_name": book.file_name,
            "cover_name": book.cover_name,
            "author": book.author,
            "language": book.language,
            "description": book.description,
            "extension": book.extension,
            "publisher": book.publisher,
            "published": book.published,
            "scope": book.scope,
            "book_rating": book.rating,
        }
