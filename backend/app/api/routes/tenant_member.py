import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.tenant_member_controller import TenantMemberController
from app.api.router import ApiRouter
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant_member import TenantMemberCreate, TenantMemberUpdate, TenantMemberPublic, TenantMemberPublicDetails

router = ApiRouter(prefix="/tenant/member", tags=["TenantMember"])


@router.api_get("/details", response_model=TenantMemberPublicDetails)
def get_details(id: uuid.UUID, controller: TenantMemberController = Depends()) -> Any:
    return controller.get_details(id)


@router.api_post("/query/details", response_model=QueryResult[TenantMemberPublicDetails])
def query_details(query: PaginationQuery, controller: TenantMemberController = Depends()) -> Any:
    return controller.query_details(query)
