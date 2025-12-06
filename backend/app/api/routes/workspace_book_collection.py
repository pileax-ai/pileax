from typing import Any, List
from uuid import UUID

from fastapi import Depends

from app.api.controllers.workspace_book_collection_controller import WorkspaceBookCollectionController
from app.api.models.query import QueryResult, PaginationQuery
from app.api.models.workspace_book import WorkspaceBookDetails, WorkspaceCollectionBookDetails
from app.api.router import ApiRouter
from app.api.models.workspace_book_collection import WorkspaceBookCollectionDetails, WorkspaceBookCollectionPublic, \
    WorkspaceBookCollectionCreate, WorkspaceBookCollectionUpdate

router = ApiRouter(prefix="/workspace/book/collection", tags=["WorkspaceWorkspaceBookCollection"])


@router.api_post("", response_model=WorkspaceBookCollectionPublic)
def save(item_in: WorkspaceBookCollectionCreate, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=WorkspaceBookCollectionPublic)
def get(id: UUID, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=WorkspaceBookCollectionPublic)
def update(item_in: WorkspaceBookCollectionUpdate, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: UUID, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[WorkspaceBookCollectionPublic])
def query(query: PaginationQuery, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/all", response_model=List[dict])
def get_all(controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.get_all()


@router.api_post("/query/book/details", response_model=QueryResult[WorkspaceCollectionBookDetails])
def query_details(query: PaginationQuery, controller: WorkspaceBookCollectionController = Depends()) -> Any:
    return controller.query_book_details(query)
