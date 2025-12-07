import uuid
from typing import Any, List

from fastapi import Depends

from app.api.controllers.user_book_controller import UserBookController
from app.api.router import ApiRouter
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user_book import UserBookCreate, UserBookUpdate, UserBookPublic, UserBookDetails, \
    UserBookUpdateReadingProgress

router = ApiRouter(prefix="/user/book", tags=["UserBook"])


@router.api_post("", response_model=UserBookPublic)
def save(item_in: UserBookCreate, controller: UserBookController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=UserBookPublic)
def get(id: uuid.UUID, controller: UserBookController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=UserBookPublic)
def update(item_in: UserBookUpdate, controller: UserBookController = Depends()) -> Any:
    return controller.update(item_in)

@router.api_put("/reading/progress", response_model=UserBookPublic)
def update_reading_progress(item_in: UserBookUpdateReadingProgress, controller: UserBookController = Depends()) -> Any:
    return controller.update_reading_progress(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: UserBookController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[UserBookPublic])
def query(query: PaginationQuery, controller: UserBookController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/details", response_model=UserBookDetails)
def get_details(id: uuid.UUID, controller: UserBookController = Depends()) -> Any:
    return controller.get_details(id)


@router.api_post("/query/details", response_model=QueryResult[UserBookDetails])
def query_details(query: PaginationQuery, controller: UserBookController = Depends()) -> Any:
    return controller.query_details(query)


@router.api_get("/stats", response_model=List[dict])
def get_details(controller: UserBookController = Depends()) -> Any:
    return controller.get_stats()
