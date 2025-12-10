from typing import Any, List
from uuid import UUID

from fastapi import Depends

from app.api.controllers.book_annotation_controller import BookAnnotationController
from app.api.router import ApiRouter

from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.book_annotation import BookAnnotationCreate, BookAnnotationUpdate, BookAnnotationPublic, \
    BookAnnotationDetails

router = ApiRouter(prefix="/book/annotation", tags=["BookAnnotation"])


@router.api_post("", response_model=BookAnnotationPublic)
def save(item_in: BookAnnotationCreate, controller: BookAnnotationController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=BookAnnotationPublic)
def get(id: UUID, controller: BookAnnotationController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=BookAnnotationPublic)
def update(item_in: BookAnnotationUpdate, controller: BookAnnotationController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: UUID, controller: BookAnnotationController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[BookAnnotationPublic])
def query(query: PaginationQuery, controller: BookAnnotationController = Depends()) -> Any:
    return controller.query(query)


@router.api_post("/query/details", response_model=QueryResult[BookAnnotationDetails])
def query_details(query: PaginationQuery, controller: BookAnnotationController = Depends()) -> Any:
    return controller.query_details(query)


@router.api_get("/all", response_model=List[BookAnnotationPublic])
def find_all_by_book(book_id: UUID, controller: BookAnnotationController = Depends()) -> Any:
    return controller.find_all_by_book(book_id)
