import uuid
from typing import Any, List

from fastapi import Depends

from app.api.controllers.tenent_default_model_controller import TenantDefaultModelController
from app.api.router import ApiRouter

from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant_default_model import TenantDefaultModelCreate, TenantDefaultModelUpdate, TenantDefaultModelPublic

router = ApiRouter(prefix="/tenant/default-model", tags=["TenantDefaultModel"])


@router.api_post("", response_model=TenantDefaultModelPublic)
def save(item_in: TenantDefaultModelCreate, controller: TenantDefaultModelController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=TenantDefaultModelPublic)
def get(id: uuid.UUID, controller: TenantDefaultModelController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=TenantDefaultModelPublic)
def update(item_in: TenantDefaultModelUpdate, controller: TenantDefaultModelController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: TenantDefaultModelController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[TenantDefaultModelPublic])
def query(query: PaginationQuery, controller: TenantDefaultModelController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/all", response_model=List[TenantDefaultModelPublic])
def find_all(controller: TenantDefaultModelController = Depends()) -> Any:
    return controller.find_all()


@router.api_get("/by-type", response_model=TenantDefaultModelPublic)
def get_by_type(model_type: str, controller: TenantDefaultModelController = Depends()) -> Any:
    return controller.get_by_type(model_type)
