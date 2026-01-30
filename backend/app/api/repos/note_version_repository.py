from itertools import starmap

from sqlalchemy import func
from sqlmodel import select

from app.api.models.note_version import NoteVersion
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user import User
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class NoteVersionRepository(BaseRepository[NoteVersion]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            NoteVersion: ["note_id", "workspace_id"],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = (
            select(NoteVersion, User)
            .join(User, NoteVersion.user_id == User.id, isouter=True)
        )
        count_stmt = (
            select(func.count())
            .select_from(NoteVersion)
            .join(User, NoteVersion.user_id == User.id, isouter=True)
        )
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [NoteVersion], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)
        print(stmt.compile(compile_kwargs={"literal_binds": True}))

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
        note_version: NoteVersion, user: User
    ) -> dict:
        return {
            **note_version.model_dump(),
            "user_name": user.name,
            "user_avatar": user.avatar,
        }
