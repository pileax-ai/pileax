from typing import Any, List
from uuid import UUID

from fastapi import Depends

from app.api.controllers.tenant_book_collection_controller import TenantBookCollectionController
from app.api.models.query import QueryResult, PaginationQuery
from app.api.models.tenant_book import TenantBookDetails, TenantCollectionBookDetails
from app.api.router import ApiRouter
from app.api.models.tenant_book_collection import TenantBookCollectionDetails, TenantBookCollectionPublic, \
    TenantBookCollectionCreate, TenantBookCollectionUpdate

router = ApiRouter(prefix="/tenant/book/collection", tags=["TenantTenantBookCollection"])


@router.api_post("", response_model=TenantBookCollectionPublic)
def save(item_in: TenantBookCollectionCreate, controller: TenantBookCollectionController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=TenantBookCollectionPublic)
def get(id: UUID, controller: TenantBookCollectionController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=TenantBookCollectionPublic)
def update(item_in: TenantBookCollectionUpdate, controller: TenantBookCollectionController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: UUID, controller: TenantBookCollectionController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[TenantBookCollectionPublic])
def query(query: PaginationQuery, controller: TenantBookCollectionController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/all", response_model=List[dict])
def get_all(controller: TenantBookCollectionController = Depends()) -> Any:
    return controller.get_all()


@router.api_post("/query/book/details", response_model=QueryResult[TenantCollectionBookDetails])
def query_details(query: PaginationQuery, controller: TenantBookCollectionController = Depends()) -> Any:
    return controller.query_book_details(query)
