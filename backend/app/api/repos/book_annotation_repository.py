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

    def group_by_book(self, user_id: UUID, workspace_id: UUID, keyword: str | None = None) -> Any:
        if keyword is not None:
            keyword = keyword.strip()
            if not keyword:
                keyword = None
        like_keyword = f"%{keyword}%" if keyword else None

        sql_template = """
            SELECT ba.*, book.title, book.cover_url, book.author, book.publisher, book.published
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
            LEFT JOIN user_book ub ON ub.book_id=book.id AND ub.user_id=:user_id
            {where_clause}
            ORDER BY ub.update_time DESC
        """

        # Dynamically build WHERE clause based on keyword presence
        params = {
            "user_id": str(user_id),
            "workspace_id": str(workspace_id),
        }

        if keyword:
            where_clause = "WHERE (book.title LIKE :like_keyword OR book.author LIKE :like_keyword)"
            params["like_keyword"] = like_keyword
        else:
            where_clause = ""

        sql: TextClause = text(sql_template.format(where_clause=where_clause))

        with self.session as session:
            conn = session.connection()
            result = conn.execute(sql, params)
            rows = result.mappings().all()

        return rows

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        condition = query.condition
        title = condition.pop("note__icontains", None)

        # 1.1 filters
        filter_mapping = {
            BookAnnotation: ["note", "title", "chapter", "book_id", "type", "workspace_id", "user_id"],
        }
        filters = DbHelper.build_filters(filter_mapping, condition)

        # 1.2 or filter
        if title:
            title_value = str(title)
            or_condition = {
                "chapter__icontains": title_value,
                "note__icontains": title_value,
                "title__icontains": title_value,
            }

            or_filter = DbHelper.build_or_filters(filter_mapping, or_condition)
            if or_filter is not None:
                filters.append(or_filter)

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
