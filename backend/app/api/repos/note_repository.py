from uuid import UUID

from sqlalchemy import func
from sqlmodel import Field, Session, SQLModel, select, or_, and_

from app.api.models.enums import Scope
from app.api.models.note import Note
from app.api.models.query import PaginationQuery, QueryResult
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class NoteRepository(BaseRepository[Note]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def find_all_by_workspace(self, user_id: UUID, workspace_id: UUID) -> list:
        statement = select(Note).where(
            and_(
                Note.workspace_id == workspace_id,
                or_(
                    Note.user_id == user_id,
                    Note.scope == Scope.WORKSPACE
                )
            )
        )

        results = self.session.exec(statement).all()
        return list(results)

    def query_my(self, query: PaginationQuery, user_id: UUID) -> QueryResult[Note]:
        # 1. Basic Filter
        # 1.1 filters
        filters = DbHelper.get_filters(self.model, query.condition)

        # 1.2 or filters
        filter_mapping = {
            Note: ["user_id", "scope"],
        }
        or_condition = {
            "userId": user_id,
            "scope": 2,
        }
        or_filter = DbHelper.build_or_filters(filter_mapping, or_condition)
        if or_filter is not None:
            filters.append(or_filter)

        # 2. stmt
        stmt = select(self.model)
        count_stmt = select(func.count()).select_from(self.model)
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [self.model], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = self.session.exec(stmt).all()

        return QueryResult[Note](
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )
