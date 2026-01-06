from typing import Any
from uuid import UUID

from fastapi import Depends, Form, UploadFile

from app.api.controllers.book_controller import BookController
from app.api.models.book import BookCreate, BookDetails, BookPublic, BookUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_book import WorkspaceBookDetails
from app.api.router import ApiRouter

router = ApiRouter(prefix="/book", tags=["Book"])


@router.api_post("", response_model=BookPublic)
def save(item_in: BookCreate, controller: BookController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=BookPublic)
def get(id: UUID, controller: BookController = Depends()) -> Any:
    return controller.get(id)


@router.api_get("/details", response_model=BookDetails)
def get_details(id: UUID, controller: BookController = Depends()) -> Any:
    return controller.get_details(id)


@router.api_get("/uuid", response_model=BookPublic)
def get_by_uuid(uuid: str, controller: BookController = Depends()) -> Any:
    return controller.get_by_uuid(uuid)


@router.api_put("", response_model=BookPublic)
def update(item_in: BookUpdate, controller: BookController = Depends()) -> Any:
    return controller.update_by_user(item_in)


@router.api_delete("")
def delete(id: UUID, controller: BookController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[BookPublic])
def query(query: PaginationQuery, controller: BookController = Depends()) -> Any:
    return controller.query(query)


@router.api_post("/query/library", response_model=QueryResult[BookPublic])
def query_library(query: PaginationQuery, controller: BookController = Depends()) -> Any:
    return controller.query_library(query)


@router.api_post("/upload", response_model=WorkspaceBookDetails)
async def upload(
    files: list[UploadFile],
    book: str = Form(...),
    controller: BookController = Depends()
) -> Any:
    return await controller.upload(book, files)
