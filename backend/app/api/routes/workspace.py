import uuid
from typing import Any, List

from fastapi import Depends

from app.api.controllers.tenant_controller import TenantController
from app.api.router import ApiRouter

from app.api.models.tenant import TenantCreate, TenantUpdate, TenantPublic

router = ApiRouter(prefix="/workspace", tags=["Workspace"])


@router.api_post("", response_model=TenantPublic)
def save(item_in: TenantCreate, controller: TenantController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=TenantPublic)
def get(id: uuid.UUID, controller: TenantController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=TenantPublic)
def update(item_in: TenantUpdate, controller: TenantController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: TenantController = Depends()) -> Any:
    return controller.delete(id)


@router.api_get("/workspaces", response_model=List[TenantPublic])
def get_user_workspaces(controller: TenantController = Depends()) -> Any:
    return controller.get_user_tenants()
