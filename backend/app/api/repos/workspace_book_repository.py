from sqlalchemy import func, text
from sqlmodel import select
from uuid import UUID

from app.api.models.book import Book
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_book import WorkspaceBook
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class WorkspaceBookRepository(BaseRepository[WorkspaceBook]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_extension_stats(self, workspace_id: UUID):
        stmt = (
            select(Book.extension.label("type"), func.count().label("count"))
            .select_from(WorkspaceBook)
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
            .where(WorkspaceBook.workspace_id == str(workspace_id))
            .group_by(Book.extension)
        )
        # print(stmt.compile(compile_kwargs={"literal_binds": True}))
        result = self.session.exec(stmt)
        return [{"type": row.type, "count": row.count} for row in result.all()]

    def get_status_stats(self, workspace_id: UUID):
        stmt = (
            select(WorkspaceBook.reading_status.label("status"), func.count().label("count"))
            .where(WorkspaceBook.workspace_id == str(workspace_id))
            .group_by(WorkspaceBook.reading_status)
        )
        print(stmt.compile(compile_kwargs={"literal_binds": True}))
        result = self.session.exec(stmt)
        return [{"status": row.status, "count": row.count} for row in result.all()]

    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(WorkspaceBook, Book)
            .join(Book, Book.id == WorkspaceBook.book_id)
            .where(WorkspaceBook.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            user_book, book = result
            return self.build_details(user_book, book)
        return None

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            WorkspaceBook: ['workspace_id', 'user_id', 'reading_status'],
            Book: ['title', 'extension'],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = (select(WorkspaceBook, Book)
            .join(Book, Book.id == WorkspaceBook.book_id)
        )
        count_stmt = (select(func.count())
            .select_from(WorkspaceBook)
            .join(Book, Book.id == WorkspaceBook.book_id)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [WorkspaceBook, Book], query.sort)

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
    def build_details(workspace_book: WorkspaceBook, book: Book) -> dict:
        return {
            **workspace_book.model_dump(),
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
