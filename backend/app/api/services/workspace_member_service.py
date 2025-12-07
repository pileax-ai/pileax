from uuid import UUID

from fastapi import HTTPException

from app.api.models.enums import Status
from app.api.models.workspace_member import WorkspaceMember
from app.api.models.query import PaginationQuery
from app.api.repos.workspace_member_repository import WorkspaceMemberRepository
from app.api.services.base_service import BaseService

class WorkspaceMemberService(BaseService[WorkspaceMember]):
    def __init__(self, session):
        super().__init__(WorkspaceMember, session, WorkspaceMemberRepository)


    def invite(self, item: WorkspaceMember) -> WorkspaceMember:
        return self.save(item)

    def accept(self, id: UUID) -> WorkspaceMember:
        obj = self.repo.get(id)
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")

        # update status
        obj.status = Status.ACCEPTED

        return self.repo.update_obj(obj);

    def get_details(self, id: UUID):
        obj = self.repo.get_details(id)
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def query_details(self, query: PaginationQuery):
        return self.repo.query_details(query)
