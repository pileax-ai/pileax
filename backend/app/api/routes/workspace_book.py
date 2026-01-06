import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.workspace_book_controller import WorkspaceBookController
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_book import (
    WorkspaceBookCreate,
    WorkspaceBookDetails,
    WorkspaceBookPublic,
    WorkspaceBookUpdate,
)
from app.api.router import ApiRouter

router = ApiRouter(prefix="/workspace/book", tags=["WorkspaceBook"])


@router.api_post("", response_model=WorkspaceBookPublic)
def save(item_in: WorkspaceBookCreate, controller: WorkspaceBookController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=WorkspaceBookPublic)
def get(id: uuid.UUID, controller: WorkspaceBookController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=WorkspaceBookPublic)
def update(item_in: WorkspaceBookUpdate, controller: WorkspaceBookController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: WorkspaceBookController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[WorkspaceBookPublic])
def query(query: PaginationQuery, controller: WorkspaceBookController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/details", response_model=WorkspaceBookDetails)
def get_details(id: uuid.UUID, controller: WorkspaceBookController = Depends()) -> Any:
    return controller.get_details(id)


@router.api_post("/query/details", response_model=QueryResult[WorkspaceBookDetails])
def query_details(query: PaginationQuery, controller: WorkspaceBookController = Depends()) -> Any:
    return controller.query_details(query)


@router.api_get("/stats", response_model=list[dict])
def get_details(controller: WorkspaceBookController = Depends()) -> Any:
    return controller.get_stats()
