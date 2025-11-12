from typing import Any

from sqlalchemy import func, text, TextClause
from sqlmodel import select
from uuid import UUID

from app.api.models.book import Book
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant_book import TenantBook
from app.api.models.tenant_book_collection import TenantBookCollection
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class TenantBookCollectionRepository(BaseRepository[TenantBookCollection]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_all(self, tenant_id: UUID) -> Any:
        sql: TextClause = text("""
            SELECT bc.*, tbc.count
            FROM book_collection bc
            LEFT JOIN (SELECT book_collection_id AS id, COUNT(*) AS count
               FROM tenant_book_collection
               WHERE tenant_id = :tenant_id
               GROUP BY book_collection_id) tbc ON tbc.id = bc.id
            WHERE bc.tenant_id = :tenant_id
       """)
        with self.session as session:
            conn = session.connection()
            result = conn.execute(sql, {"tenant_id": str(tenant_id)})
            rows = result.mappings().all()

        return rows


    def query_book_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            TenantBookCollection: ['book_collection_id', 'tenant_id'],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = (select(TenantBookCollection, TenantBook, Book)
            .join(TenantBook, TenantBook.id == TenantBookCollection.tenant_book_id, isouter=True)
            .join(Book, Book.id == TenantBook.book_id, isouter=True)
        )
        count_stmt = (select(func.count())
            .select_from(TenantBookCollection)
            .join(TenantBook, TenantBook.id == TenantBookCollection.tenant_book_id, isouter=True)
            .join(Book, Book.id == TenantBook.book_id, isouter=True)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [TenantBookCollection, TenantBook, Book], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)
        print(stmt.compile(compile_kwargs={"literal_binds": True}))

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = [
            self.build_details(tenant_book_collection, tenant_book, book)
            for tenant_book_collection, tenant_book, book in self.session.exec(stmt).all()
        ]
        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    @staticmethod
    def build_details(tenant_book_collection: TenantBookCollection, tenant_book: TenantBook, book: Book) -> dict:
        return {
            **tenant_book.model_dump(),
            "tid": tenant_book_collection.id,
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
