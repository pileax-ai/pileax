import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.user_book_controller import UserBookController
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.user_book import (
    UserBookCreate,
    UserBookDetails,
    UserBookPublic,
    UserBookUpdate,
    UserBookUpdateReadingProgress,
)
from app.api.router import ApiRouter

router = ApiRouter(prefix="/user/book", tags=["UserBook"])


@router.api_post("", response_model=UserBookPublic)
async def save(item_in: UserBookCreate, controller: UserBookController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=UserBookPublic)
async def get(id: uuid.UUID, controller: UserBookController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=UserBookPublic)
async def update(item_in: UserBookUpdate, controller: UserBookController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_put("/reading/progress", response_model=UserBookPublic)
async def update_reading_progress(item_in: UserBookUpdateReadingProgress, controller: UserBookController = Depends()) -> Any:
    return controller.update_reading_progress(item_in)


@router.api_delete("")
async def delete(id: uuid.UUID, controller: UserBookController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[UserBookPublic])
async def query(query: PaginationQuery, controller: UserBookController = Depends()) -> Any:
    return controller.query(query)


@router.api_get("/details", response_model=UserBookDetails)
async def get_details(id: uuid.UUID, controller: UserBookController = Depends()) -> Any:
    return controller.get_details(id)


@router.api_post("/query/details", response_model=QueryResult[UserBookDetails])
async def query_details(query: PaginationQuery, controller: UserBookController = Depends()) -> Any:
    return controller.query_details(query)


@router.api_get("/stats", response_model=list[dict])
async def get_stats(controller: UserBookController = Depends()) -> Any:
    return controller.get_stats()
