import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.tenant_controller import TenantController
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant import TenantCreate, TenantPublic, TenantUpdate
from app.api.router import ApiRouter

router = ApiRouter(prefix="/tenant", tags=["Tenant"])


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


@router.api_post("/query", response_model=QueryResult[TenantPublic])
def query(query: PaginationQuery, controller: TenantController = Depends()) -> Any:
    return controller.query(query)
