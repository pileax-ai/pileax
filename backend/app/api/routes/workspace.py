from typing import Any, List

from app.api.controllers.tenant_controller import TenantController
from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUserId
from app.api.models.tenant import TenantPublic

router = ApiRouter(prefix="/workspace", tags=["Workspace"])


@router.api_get("/workspaces", response_model=List[TenantPublic])
def get_user_workspaces(session: SessionDep, user_id: CurrentUserId) -> Any:
    return TenantController(session, user_id).get_user_tenants(user_id)
