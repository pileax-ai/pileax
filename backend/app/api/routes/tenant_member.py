import uuid
from typing import Any, List

from app.api.controllers.tenant_member_controller import TenantMemberController
from app.api.router import ApiRouter
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant_member import TenantMemberCreate, TenantMemberUpdate, TenantMemberPublic, TenantMemberPublicDetails

router = ApiRouter(prefix="/tenant/member", tags=["TenantMember"])


@router.api_get("/details", response_model=TenantMemberPublicDetails)
def get_details(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return TenantMemberController(session, user_id=user_id).get_details(id)


@router.api_post("/query/details", response_model=QueryResult[TenantMemberPublicDetails])
def query_details(query: PaginationQuery, session: SessionDep, tenant_id: CurrentTenantId) -> Any:
    return TenantMemberController(session, tenant_id=tenant_id).query_details(query)
