from itertools import starmap
from typing import Any
from uuid import UUID

from sqlalchemy import TextClause, and_, func, text
from sqlmodel import select

from app.api.models.book import Book
from app.api.models.book_collection import BookCollection
from app.api.models.enums import BookCollectionType
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user_book import UserBook
from app.api.models.workspace_book import WorkspaceBook
from app.api.repos.base_repository import BaseRepository
from app.libs.book.book_helper import BookHelper
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

    def get_status_stats(self, user_id: UUID, workspace_id: UUID):
        stmt = (
            select(UserBook.reading_status.label("status"), func.count().label("count"))
            .select_from(WorkspaceBook)
            .join(UserBook, UserBook.book_id == WorkspaceBook.book_id, isouter=True)
            .filter(WorkspaceBook.workspace_id == str(workspace_id), UserBook.user_id == str(user_id))
            .group_by(UserBook.reading_status)
        )
        # print(stmt.compile(compile_kwargs={"literal_binds": True}))
        result = self.session.exec(stmt)
        return [{"status": row.status, "count": row.count} for row in result.all()]

    def group(self, user_id: UUID, workspace_id: UUID) -> Any:
        sql: TextClause = text("""
            SELECT bc.*, tbc.count
            FROM book_collection bc
            LEFT JOIN (SELECT book_group_id AS id, COUNT(*) AS count
               FROM workspace_book
               WHERE workspace_id=:workspace_id AND user_id=:user_id
               GROUP BY book_group_id) tbc ON tbc.id=bc.id
            WHERE bc.workspace_id=:workspace_id AND bc.user_id=:user_id AND bc.type=:type
            ORDER BY bc.create_time ASC
       """)
        with self.session as session:
            conn = session.connection()
            result = conn.execute(
                sql,
                {
                    "user_id": str(user_id),
                    "workspace_id": str(workspace_id),
                    "type": BookCollectionType.GROUP,
                },
            )
            rows = result.mappings().all()

        return rows

    def get_workspace_book_details(self, book_id: UUID, user_id: UUID, workspace_id: UUID):
        stmt = (
            select(WorkspaceBook, Book, UserBook)
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
            .join(
                UserBook,
                and_(UserBook.book_id == WorkspaceBook.book_id, UserBook.user_id == WorkspaceBook.user_id),
                isouter=True,
            )
            .where(WorkspaceBook.book_id == book_id)
            .where(WorkspaceBook.user_id == user_id)
            .where(WorkspaceBook.workspace_id == workspace_id)
        )
        result = self.session.exec(stmt).first()
        if result:
            workspace_book, book, user_book = result
            return self.build_details(workspace_book, book, user_book)
        return None

    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(WorkspaceBook, Book, UserBook)
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
            .join(
                UserBook,
                and_(UserBook.book_id == WorkspaceBook.book_id, UserBook.user_id == WorkspaceBook.user_id),
                isouter=True,
            )
            .where(WorkspaceBook.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            workspace_book, book, user_book = result
            return self.build_details(workspace_book, book, user_book)
        return None

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        condition = query.condition
        title = condition.pop("title__icontains", None)

        # 1.1 filters
        filter_mapping = {
            WorkspaceBook: ["workspace_id", "user_id", "book_group_id"],
            Book: ["author", "description", "extension", "isbn", "publisher", "subtitle", "title", "title_pinyin"],
            UserBook: ["reading_status", "is_removed", "is_physical"],
        }
        filters = DbHelper.build_filters(filter_mapping, condition)

        # 1.2 or filter
        if title:
            title_value = str(title)
            or_condition = {}
            if BookHelper.is_isbn(title_value):
                or_condition["isbn"] = title_value
            else:
                or_condition = {
                    "author__icontains": title_value,
                    "description__icontains": title_value,
                    "publisher__icontains": title_value,
                    "subtitle__icontains": title_value,
                    "title__icontains": title_value,
                }
                if DbHelper.is_pinyin(title_value):
                    or_condition["title_pinyin__icontains"] = title_value

            or_filter = DbHelper.build_or_filters(filter_mapping, or_condition)
            if or_filter is not None:
                filters.append(or_filter)

        # 2. stmt
        stmt = (
            select(WorkspaceBook, Book, UserBook)
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
            .join(
                UserBook,
                and_(UserBook.book_id == WorkspaceBook.book_id, UserBook.user_id == WorkspaceBook.user_id),
                isouter=True,
            )
        )
        count_stmt = (
            select(func.count())
            .select_from(WorkspaceBook)
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
            .join(
                UserBook,
                and_(UserBook.book_id == WorkspaceBook.book_id, UserBook.user_id == WorkspaceBook.user_id),
                isouter=True,
            )
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [WorkspaceBook, Book, UserBook], query.sort)

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

    def query_groups(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        condition = query.condition
        title = condition.pop("title__icontains", None)

        # 1.1 filters
        filter_mapping = {
            WorkspaceBook: ["workspace_id", "user_id", "book_group_id"],
            Book: ["author", "description", "extension", "isbn", "publisher", "subtitle", "title", "title_pinyin"],
            UserBook: ["reading_status", "is_removed", "is_physical"],
            BookCollection: ["id", "name"],
        }
        filters = DbHelper.build_filters(filter_mapping, condition)

        default_uuid = "00000000-0000-0000-0000-000000000000"
        filters.append(WorkspaceBook.book_group_id != default_uuid)

        # 1.2 or filter
        if title:
            title_value = str(title)
            or_condition = {}
            if BookHelper.is_isbn(title_value):
                or_condition["isbn"] = title_value
            else:
                or_condition = {
                    "author__icontains": title_value,
                    "description__icontains": title_value,
                    "publisher__icontains": title_value,
                    "subtitle__icontains": title_value,
                    "title__icontains": title_value,
                }
                if DbHelper.is_pinyin(title_value):
                    or_condition["title_pinyin__icontains"] = title_value

            or_filter = DbHelper.build_or_filters(filter_mapping, or_condition)
            if or_filter is not None:
                filters.append(or_filter)

        # 2. Sub-query for counting
        group_subq = (
            select(
                WorkspaceBook.book_group_id.label("book_group_id"),
                func.count(func.distinct(WorkspaceBook.id)).label("count"),
            )
            .join(Book, Book.id == WorkspaceBook.book_id, isouter=True)
            .join(
                UserBook,
                and_(UserBook.book_id == WorkspaceBook.book_id, UserBook.user_id == WorkspaceBook.user_id),
                isouter=True,
            )
            .group_by(WorkspaceBook.book_group_id)
        )

        if filters:
            group_subq = group_subq.where(*filters)

        group_subq = group_subq.subquery("wb")

        # 3. Main query
        stmt = (
            select(
                group_subq.c.book_group_id,
                group_subq.c.count,
                BookCollection,
                WorkspaceBook,
                Book,
                UserBook,
            )
            .select_from(group_subq)
            .join(
                BookCollection,
                BookCollection.id == group_subq.c.book_group_id,
                isouter=True,
            )
            .join(
                WorkspaceBook,
                WorkspaceBook.book_group_id == group_subq.c.book_group_id,
                isouter=True,
            )
            .join(
                Book,
                Book.id == WorkspaceBook.book_id,
                isouter=True,
            )
            .join(
                UserBook,
                and_(UserBook.book_id == WorkspaceBook.book_id, UserBook.user_id == WorkspaceBook.user_id),
                isouter=True,
            )
        )

        # 3.1 filters
        if filters:
            stmt = stmt.where(*filters).order_by(group_subq.c.count.desc())

        # 4. Sort
        stmt = DbHelper.apply_sort(stmt, [WorkspaceBook, Book, BookCollection], query.sort)
        # print(stmt.compile(compile_kwargs={"literal_binds": True}))

        # 5. Execute Query
        results = self.session.exec(stmt).all()

        # 6. Group books
        groups_map = {}
        for group_id, count, collection, workspace_book, book, user_book in results:
            if group_id not in groups_map:
                groups_map[group_id] = {
                    "id": group_id,
                    "count": count,
                    "collection": collection.model_dump() if collection else {},
                    "books": [],
                }

            if workspace_book and book:
                group_book = self.build_group_book(workspace_book, book)
                groups_map[group_id]["books"].append(group_book)

        # 7. Books sort
        for group in groups_map.values():
            group["books"].sort(key=lambda x: x.get("update_time") or 0, reverse=True)

        rows = list(groups_map.values())

        return QueryResult(
            total=len(rows),
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    @staticmethod
    def build_details(workspace_book: WorkspaceBook, book: Book, user_book: UserBook | None = None) -> dict:
        return {
            **workspace_book.model_dump(),
            "book_user_id": book.user_id,
            "book_workspace_id": book.workspace_id,
            # book
            "title": book.title,
            "subtitle": book.subtitle,
            "path": book.path,
            "file_url": book.file_url,
            "cover_url": book.cover_url,
            "author": book.author,
            "language": book.language,
            "description": book.description,
            "extension": book.extension,
            "publisher": book.publisher,
            "published": book.published,
            "rating": book.rating,
            "scope": book.scope,
            "media": book.media,
            "isbn": book.isbn,
            "ref_url": book.ref_url,
            "book_extra": book.extra,
            # user_book
            "user_book_id": user_book.id if user_book else None,
            "reading_position": user_book.reading_position if user_book else None,
            "reading_percentage": user_book.reading_percentage if user_book else None,
            "reading_status": user_book.reading_status if user_book else None,
            "user_rating": user_book.rating if user_book else None,
            "user_extra": user_book.extra if user_book else None,
            "is_physical": user_book.is_physical if user_book else None,
            "location": user_book.location if user_book else None,
            "create_time": user_book.create_time if user_book else None,
            "update_time": user_book.update_time if user_book else None,
        }

    @staticmethod
    def build_group_book(workspace_book: WorkspaceBook, book: Book) -> dict:
        return {
            **book.model_dump(),
            "update_time": workspace_book.update_time,
        }

    @staticmethod
    def build_collection_details(group_id: str, count: int, collection: BookCollection | None) -> dict:
        """Build collection detail item from raw query row tuple."""
        collection_dict = collection.model_dump() if collection else {}

        return {
            "id": group_id,
            "count": count,
            "collection": collection_dict,
        }
