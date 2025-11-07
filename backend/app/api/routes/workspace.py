from typing import Any, List

from fastapi import Depends

from app.api.controllers.tenant_controller import TenantController
from app.api.router import ApiRouter

from app.api.models.tenant import TenantPublic

router = ApiRouter(prefix="/workspace", tags=["Workspace"])


@router.api_get("/workspaces", response_model=List[TenantPublic])
def get_user_workspaces(controller: TenantController = Depends()) -> Any:
    return controller.get_user_tenants()
