import uuid
from uuid import UUID

from fastapi import Depends, HTTPException

from app.api.deps import CurrentTenantId
from app.api.models.tenant_member import TenantMember
from app.api.models.query import PaginationQuery
from app.api.repos.tenant_member_repository import TenantMemberRepository
from app.api.services.base_service import BaseService

class TenantMemberService(BaseService[TenantMember]):
    def __init__(self, session):
        super().__init__(TenantMember, session, TenantMemberRepository)

    def get_details(self, id: UUID):
        obj = self.repo.get_details(id)
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def query_details(self, query: PaginationQuery, tenant_id: uuid.UUID = Depends(CurrentTenantId)):
        return self.repo.query_details(query)
