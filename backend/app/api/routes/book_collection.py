from typing import Any
from uuid import UUID

from fastapi import Depends

from app.api.controllers.book_collection_controller import BookCollectionController
from app.api.models.book_collection import BookCollectionCreate, BookCollectionPublic, BookCollectionUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.router import ApiRouter

router = ApiRouter(prefix="/book/collection", tags=["BookCollection"])


@router.api_post("", response_model=BookCollectionPublic)
def save(item_in: BookCollectionCreate, controller: BookCollectionController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=BookCollectionPublic)
def get(id: UUID, controller: BookCollectionController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=BookCollectionPublic)
def update(item_in: BookCollectionUpdate, controller: BookCollectionController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: UUID, controller: BookCollectionController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[BookCollectionPublic])
def query(query: PaginationQuery, controller: BookCollectionController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/all", response_model=list[BookCollectionPublic])
def find_all(controller: BookCollectionController = Depends()) -> Any:
    return controller.find_all()
