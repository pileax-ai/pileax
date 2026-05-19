from itertools import starmap
from typing import Any
from uuid import UUID

from sqlalchemy import TextClause, func, text
from sqlmodel import select

from app.api.models.book import Book
from app.api.models.book_annotation import BookAnnotation
from app.api.models.query import PaginationQuery, QueryResult
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class BookAnnotationRepository(BaseRepository[BookAnnotation]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def group_by_book(self, user_id: UUID, workspace_id: UUID) -> Any:
        sql: TextClause = text("""
            SELECT ba.*, book.title, book.cover_url
            FROM (
                SELECT book_id, COUNT(*) as count
                FROM book_annotation ba_inner
                WHERE user_id=:user_id
                  AND EXISTS (
                    SELECT 1
                    FROM workspace_book wb
                    WHERE wb.book_id = ba_inner.book_id AND wb.workspace_id = :workspace_id
                  )
                GROUP BY book_id
            ) ba
            LEFT JOIN book ON ba.book_id=book.id
       """)
        with self.session as session:
            conn = session.connection()
            result = conn.execute(sql, {"user_id": str(user_id), "workspace_id": str(workspace_id)})
            rows = result.mappings().all()

        return rows

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filters = DbHelper.get_filters(
            BookAnnotation, query.condition, ["note", "book_id", "type", "workspace_id", "user_id"]
        )

        # 2. stmt
        stmt = select(BookAnnotation, Book).join(Book, Book.id == BookAnnotation.book_id)
        count_stmt = select(func.count()).select_from(BookAnnotation).join(Book, Book.id == BookAnnotation.book_id)
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [BookAnnotation], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)
        # print(stmt.compile(compile_kwargs={"literal_binds": True}))

        # 5. Query
        # 5.1 Total
        total = self.session.exec(count_stmt).one()

        # 5.2 Rows
        rows = list(starmap(self._build_details, self.session.exec(stmt).all()))

        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def _build_details(self, book_annotation: BookAnnotation, book: Book) -> dict:
        return {
            **book_annotation.model_dump(),
            "book_title": book.title,
            "file_url": book.file_url,
            "cover_url": book.cover_url,
        }
