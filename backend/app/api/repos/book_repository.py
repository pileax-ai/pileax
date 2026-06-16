from itertools import starmap
from uuid import UUID

from sqlalchemy import and_, func, or_, select

from app.api.models.book import Book, BookPublic
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user_book import UserBook
from app.api.models.workspace_book import WorkspaceBook
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

    def get_wb_details(self, id: UUID, user_id: UUID, workspace_id: UUID):
        stmt = (
            select(WorkspaceBook, Book, UserBook)
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
            .join(
                UserBook,
                and_(UserBook.book_id == WorkspaceBook.book_id, UserBook.user_id == WorkspaceBook.user_id),
                isouter=True,
            )
            .where(WorkspaceBook.book_id == id)
            .where(WorkspaceBook.user_id == user_id)
            .where(WorkspaceBook.workspace_id == workspace_id)
        )
        result = self.session.exec(stmt).first()
        if result:
            workspace_book, book, user_book = result
            return self.build_wb_details(workspace_book, book, user_book)
        return None

    def query_library(self, user_id: UUID, workspace_id: UUID, query: PaginationQuery) -> QueryResult[BookPublic]:
        # 1. Basic Filter
        filters = DbHelper.get_filters(Book, query.condition)
        filters.append(or_(Book.user_id == user_id, Book.workspace_id == workspace_id))

        # 2. stmt
        stmt = select(Book, WorkspaceBook).join(
            WorkspaceBook,
            and_(
                Book.id == WorkspaceBook.book_id,
                WorkspaceBook.user_id == user_id,
                WorkspaceBook.workspace_id == workspace_id,
            ),
            isouter=True,
        )
        count_stmt = select(func.count()).select_from(Book)
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [Book], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)
        # print(stmt.compile(compile_kwargs={"literal_binds": True}))

        # 5. Query
        total = self.session.exec(count_stmt).one()
        # rows = [row[0] for row in self.session.exec(stmt).all()]
        rows = list(starmap(self.build_public, self.session.exec(stmt).all()))

        return QueryResult[BookPublic](
            total=total[0],
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    @staticmethod
    def build_public(book: Book, workspace_book: WorkspaceBook | None = None) -> dict:
        return {
            **book.model_dump(),
            "workspace_book_id": workspace_book.id if workspace_book else None,
        }

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

    @staticmethod
    def build_wb_details(workspace_book: WorkspaceBook, book: Book, user_book: UserBook | None = None) -> dict:
        if book is None:
            return None

        return {
            **book.model_dump(),
            "owner": book.user_id,
            # workspace_book
            "user_id": workspace_book.user_id if workspace_book else None,
            "workspace_id": workspace_book.workspace_id if workspace_book else None,
            # user_book
            "user_book_id": user_book.id if user_book else None,
            "user_extra": user_book.extra if user_book else None,
            "user_rating": user_book.rating if user_book else None,
            "reading_position": user_book.reading_position if user_book else None,
            "reading_percentage": user_book.reading_percentage if user_book else None,
            "reading_status": user_book.reading_status if user_book else None,
            "is_physical": user_book.is_physical if user_book else None,
            "location": user_book.location if user_book else None,
            "create_time": user_book.create_time if user_book else None,
            "update_time": user_book.update_time if user_book else None,
        }
