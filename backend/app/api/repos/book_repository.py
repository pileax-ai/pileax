from uuid import UUID

from sqlalchemy import func, or_, select

from app.api.models.book import Book, BookPublic
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user_book import UserBook
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class BookRepository(BaseRepository[Book]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_details(self, id: UUID, user_id: UUID) -> dict | None:
        stmt = (
            select(Book, UserBook)
            .join(UserBook, UserBook.book_id == Book.id, isouter=True)
            .filter(
                Book.id == id,
                UserBook.user_id == user_id,
            )
        )
        result = self.session.exec(stmt).first()
        if result:
            book, user_book = result
            return self.build_details(book, user_book)
        return None

    def query_library(self, user_id: UUID, workspace_id: UUID, query: PaginationQuery) -> QueryResult[BookPublic]:
        # 1. Basic Filter
        filters = DbHelper.get_filters(Book, query.condition)
        filters.append(
            or_(Book.user_id == user_id, Book.workspace_id == workspace_id)
        )

        # 2. stmt
        stmt = select(Book)
        count_stmt = select(func.count()).select_from(Book)
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [Book], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)

        # 5. Query
        total = self.session.exec(count_stmt).one()
        # rows = self.session.exec(stmt).all()
        rows = [row[0] for row in self.session.exec(stmt).all()]

        return QueryResult[BookPublic](
            total=total[0],
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    @staticmethod
    def build_details(book: Book, user_book: UserBook | None = None) -> dict:

        return {
            **book.model_dump(),

            "user_book_id": user_book.id if user_book else None,
            "rating": user_book.rating if user_book else None,
            "reading_position": user_book.reading_position if user_book else None,
            "reading_percentage": user_book.reading_percentage if user_book else None,
            "reading_status": user_book.reading_status if user_book else None,
        }
