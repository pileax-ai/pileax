from sqlalchemy import func
from sqlmodel import select

from app.api.models.book import Book
from app.api.models.book_annotation import BookAnnotation
from app.api.models.query import PaginationQuery, QueryResult
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class BookAnnotationRepository(BaseRepository[BookAnnotation]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filters = DbHelper.get_filters(BookAnnotation, query.condition, ['note', 'book_id', 'type', 'workspace_id', 'user_id'])

        # 2. stmt
        stmt = (select(BookAnnotation, Book)
            .join(Book, Book.id == BookAnnotation.book_id)
        )
        count_stmt = (select(func.count())
            .select_from(BookAnnotation)
            .join(Book, Book.id == BookAnnotation.book_id)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [BookAnnotation], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)
        print(stmt.compile(compile_kwargs={"literal_binds": True}))

        # 5. Query
        # 5.1 Total
        total = self.session.exec(count_stmt).one()

        # 5.2 Rows
        rows = [
            self._build_details(user_book, book)
            for user_book, book in self.session.exec(stmt).all()
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
