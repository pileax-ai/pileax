from itertools import starmap
from typing import Any
from uuid import UUID

from sqlalchemy import TextClause, func, text
from sqlmodel import select

from app.api.models.book import Book
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_book import WorkspaceBook
from app.api.models.workspace_book_collection import WorkspaceBookCollection
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class WorkspaceBookCollectionRepository(BaseRepository[WorkspaceBookCollection]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_all(self, user_id: UUID, workspace_id: UUID) -> Any:
        sql: TextClause = text("""
            SELECT bc.*, tbc.count
            FROM book_collection bc
            LEFT JOIN (SELECT book_collection_id AS id, COUNT(*) AS count
               FROM workspace_book_collection
               WHERE workspace_id = :workspace_id
               GROUP BY book_collection_id) tbc ON tbc.id = bc.id
            WHERE bc.workspace_id=:workspace_id and bc.user_id=:user_id
       """)
        with self.session as session:
            conn = session.connection()
            result = conn.execute(sql, {"user_id": str(user_id), "workspace_id": str(workspace_id)})
            rows = result.mappings().all()

        return rows

    def query_book_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            WorkspaceBookCollection: ["book_collection_id", "workspace_id"],
            WorkspaceBook: ["user_id"],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = (
            select(WorkspaceBookCollection, WorkspaceBook, Book)
            .join(WorkspaceBook, WorkspaceBook.id == WorkspaceBookCollection.workspace_book_id, isouter=True)
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
        )
        count_stmt = (
            select(func.count())
            .select_from(WorkspaceBookCollection)
            .join(WorkspaceBook, WorkspaceBook.id == WorkspaceBookCollection.workspace_book_id, isouter=True)
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [WorkspaceBookCollection, WorkspaceBook, Book], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)
        # print(stmt.compile(compile_kwargs={"literal_binds": True}))

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = list(starmap(self.build_details, self.session.exec(stmt).all()))
        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    @staticmethod
    def build_details(
        workspace_book_collection: WorkspaceBookCollection, workspace_book: WorkspaceBook, book: Book
    ) -> dict:
        return {
            **workspace_book.model_dump(),
            "tid": workspace_book_collection.id,
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
