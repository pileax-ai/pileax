from sqlalchemy import func
from sqlmodel import select

from app.api.models.book import Book
from app.api.models.book_annotation import BookAnnotation
from app.api.models.query import PaginationQuery, QueryResult
from app.api.repos.base_repository import BaseRepository
from app.utils.db_util import DbUtil


class BookAnnotationRepository(BaseRepository[BookAnnotation]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filters = DbUtil.get_filters(BookAnnotation, query.condition, ['note', 'book_id', 'type', 'user_id'])

        # 2. stmt
        stmt = (
            select(BookAnnotation, Book)
            .join(Book, Book.id == BookAnnotation.book_id)
        )
        count_stmt = (
            select(func.count())
            .select_from(BookAnnotation)
            .join(Book, Book.id == BookAnnotation.book_id)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        for field, direction in query.sort.items():
            if hasattr(BookAnnotation, field):
                column = getattr(BookAnnotation, field)
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

    def _build_details(self, book_annotation: BookAnnotation, book: Book) -> dict:
        return {
            **book_annotation.model_dump(),
            "book_title": book.title,
            "path": book.path,
            "file_name": book.file_name,
            "cover_name": book.cover_name,
        }
