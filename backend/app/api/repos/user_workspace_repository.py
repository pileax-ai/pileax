import uuid
from typing import List

from sqlalchemy import func
from sqlalchemy.util import deprecated
from sqlmodel import select
from uuid import UUID

from app.api.models.enums import Status
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace import Workspace
from app.api.models.workspace_member import WorkspaceMember
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class UserWorkspaceRepository(BaseRepository[WorkspaceMember]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_user_workspaces(self, user_id: uuid.UUID) -> List[Workspace]:
        stmt = (
            select(Workspace)
            .join(WorkspaceMember, WorkspaceMember.workspace_id == Workspace.id)
            .where(
                WorkspaceMember.user_id == user_id,
                Workspace.status == Status.ACTIVE
            )
        )
        workspaces: List[Workspace] = list(self.session.exec(stmt).all())
        return workspaces

    @deprecated
    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(WorkspaceMember, Workspace)
            .join(Workspace, Workspace.id == WorkspaceMember.workspace_id)
            .where(WorkspaceMember.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            workspace_member, workspace = result
            return self._build_details(workspace_member, workspace)
        return None

    @deprecated
    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            WorkspaceMember: ['workspace_id', 'user_id'],
            Workspace: ['name', 'plan', 'type'],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = (select(WorkspaceMember, Workspace)
            .join(Workspace, Workspace.id == WorkspaceMember.workspace_id)
        )
        count_stmt = (select(func.count())
            .select_from(WorkspaceMember)
            .join(Workspace, Workspace.id == WorkspaceMember.workspace_id)
        )

        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [WorkspaceMember, Workspace], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = [
            self._build_details(workspace_member, workspace)
            for workspace_member, workspace in self.session.exec(stmt).all()
        ]

        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def _build_details(self, workspace_member: WorkspaceMember, workspace: Workspace) -> dict:
        return {
            **workspace_member.model_dump(),
            "name": workspace.name,
            "plan": workspace.plan,
            "type": workspace.type,
        }
