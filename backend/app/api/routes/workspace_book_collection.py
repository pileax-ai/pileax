from typing import Any
from uuid import UUID

from fastapi import Depends

from app.api.controllers.workspace_book_collection_controller import WorkspaceBookCollectionController
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_book import WorkspaceCollectionBookDetails
from app.api.models.workspace_book_collection import (
    WorkspaceBookCollectionCreate,
    WorkspaceBookCollectionPublic,
    WorkspaceBookCollectionUpdate,
)
from app.api.router import ApiRouter

router = ApiRouter(prefix="/workspace/book/collection", tags=["WorkspaceWorkspaceBookCollection"])


@router.api_post("", response_model=WorkspaceBookCollectionPublic)
async def save(item_in: WorkspaceBookCollectionCreate, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=WorkspaceBookCollectionPublic)
async def get(id: UUID, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=WorkspaceBookCollectionPublic)
async def update(item_in: WorkspaceBookCollectionUpdate, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
async def delete(id: UUID, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[WorkspaceBookCollectionPublic])
async def query(query: PaginationQuery, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/all", response_model=list[dict])
async def get_all(controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.get_all()


@router.api_post("/query/book/details", response_model=QueryResult[WorkspaceCollectionBookDetails])
async def query_details(query: PaginationQuery, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.query_book_details(query)
