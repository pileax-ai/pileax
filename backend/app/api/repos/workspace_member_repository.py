from itertools import starmap
from uuid import UUID

from sqlalchemy import func
from sqlmodel import select

from app.api.models.enums import Status
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user import User
from app.api.models.workspace import Workspace, WorkspaceDetails
from app.api.models.workspace_member import WorkspaceMember
from app.api.repos.base_repository import BaseRepository
from app.libs.db_helper import DbHelper


class WorkspaceMemberRepository(BaseRepository[WorkspaceMember]):
    def __init__(self, model, session):
        super().__init__(model, session)

    def get_user_workspace(self, user_id: UUID, workspace_id: UUID) -> WorkspaceDetails | None:
        stmt = (
            select(WorkspaceMember, Workspace, User)
            .join(Workspace, Workspace.id == WorkspaceMember.workspace_id)
            .join(User, User.id == WorkspaceMember.user_id)
            .where(
                WorkspaceMember.user_id == user_id,
                WorkspaceMember.workspace_id == workspace_id,
                WorkspaceMember.status == Status.ACTIVE,
            )
        )
        result = self.session.exec(stmt).first()
        if result:
            workspace_member, workspace, user = result
            return WorkspaceDetails(**self._build_workspace_details(workspace_member, workspace, user))
        return None

    def get_invite(self, user_id: UUID) -> dict | None:
        stmt = (
            select(WorkspaceMember, User, Workspace)
            .join(User, User.id == WorkspaceMember.invited_by)
            .join(Workspace, Workspace.id == WorkspaceMember.workspace_id)
            .where(WorkspaceMember.user_id == user_id)
            .where(WorkspaceMember.status == Status.PENDING)
        )
        result = self.session.exec(stmt).first()
        if result:
            workspace_member, user, workspace = result
            return self._build_invite(workspace_member, user, workspace)
        return None

    def get_details(self, id: UUID) -> dict | None:
        stmt = (
            select(WorkspaceMember, User).join(User, User.id == WorkspaceMember.user_id).where(WorkspaceMember.id == id)
        )
        result = self.session.exec(stmt).first()
        if result:
            workspace_member, user = result
            return self._build_details(workspace_member, user)
        return None

    def query_details(self, query: PaginationQuery) -> QueryResult:
        # 1. Filters
        filter_mapping = {
            WorkspaceMember: ["workspace_id", "user_id"],
            User: ["name"],
        }
        filters = DbHelper.build_filters(filter_mapping, query.condition)

        # 2. stmt
        stmt = select(WorkspaceMember, User).join(User, User.id == WorkspaceMember.user_id)
        count_stmt = select(func.count()).select_from(WorkspaceMember).join(User, User.id == WorkspaceMember.user_id)

        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [WorkspaceMember, User], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = list(starmap(self._build_details, self.session.exec(stmt).all()))

        return QueryResult(
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def _build_workspace_details(self, workspace_member: WorkspaceMember, workspace: Workspace, user: User) -> dict:
        return {
            **workspace.model_dump(),
            "member_role": workspace_member.role,
            "member_status": workspace_member.status,
        }

    def _build_details(self, workspace_member: WorkspaceMember, user: User) -> dict:
        return {
            **workspace_member.model_dump(),
            "user_name": user.name,
            "user_email": user.email,
            "last_active_time": user.last_active_time,
        }

    def _build_invite(self, workspace_member: WorkspaceMember, user: User, workspace: Workspace) -> dict:
        return {
            **workspace_member.model_dump(),
            "invited_by_name": user.name,
            "workspace_name": workspace.name,
        }
