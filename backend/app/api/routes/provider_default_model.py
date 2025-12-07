import uuid
from typing import Any, List

from fastapi import Depends

from app.api.controllers.provider_default_model_controller import ProviderDefaultModelController
from app.api.router import ApiRouter

from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.provider_default_model import ProviderDefaultModelCreate, ProviderDefaultModelUpdate, ProviderDefaultModelPublic

router = ApiRouter(prefix="/provider/default-model", tags=["ProviderDefaultModel"])


@router.api_post("", response_model=ProviderDefaultModelPublic)
def save(item_in: ProviderDefaultModelCreate, controller: ProviderDefaultModelController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=ProviderDefaultModelPublic)
def get(id: uuid.UUID, controller: ProviderDefaultModelController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=ProviderDefaultModelPublic)
def update(item_in: ProviderDefaultModelUpdate, controller: ProviderDefaultModelController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: ProviderDefaultModelController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[ProviderDefaultModelPublic])
def query(query: PaginationQuery, controller: ProviderDefaultModelController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/all", response_model=List[ProviderDefaultModelPublic])
def find_all(controller: ProviderDefaultModelController = Depends()) -> Any:
    return controller.find_all()


@router.api_get("/by-type", response_model=ProviderDefaultModelPublic)
def get_by_type(model_type: str, controller: ProviderDefaultModelController = Depends()) -> Any:
    return controller.get_by_type(model_type)
