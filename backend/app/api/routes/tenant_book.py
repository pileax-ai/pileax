import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.tenant_book_controller import TenantBookController
from app.api.router import ApiRouter
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant_book import TenantBookCreate, TenantBookUpdate, TenantBookPublic, TenantBookDetails

router = ApiRouter(prefix="/tenant/book", tags=["TenantBook"])


@router.api_post("", response_model=TenantBookPublic)
def save(item_in: TenantBookCreate, controller: TenantBookController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=TenantBookPublic)
def get(id: uuid.UUID, controller: TenantBookController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=TenantBookPublic)
def update(item_in: TenantBookUpdate, controller: TenantBookController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: TenantBookController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[TenantBookPublic])
def query(query: PaginationQuery, controller: TenantBookController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/details", response_model=TenantBookDetails)
def get_details(id: uuid.UUID, controller: TenantBookController = Depends()) -> Any:
    return controller.get_details(id)


@router.api_post("/query/details", response_model=QueryResult[TenantBookDetails])
def query_details(query: PaginationQuery, controller: TenantBookController = Depends()) -> Any:
    return controller.query_details(query)
