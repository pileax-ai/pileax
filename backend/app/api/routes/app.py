import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.app_controller import AppController
from app.api.models.app import AppCreate, AppPublic, AppUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.router import ApiRouter

router = ApiRouter(prefix="/app", tags=["App"])


@router.api_post("", response_model=AppPublic)
def save(item_in: AppCreate, controller: AppController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=AppPublic)
def get(id: uuid.UUID, controller: AppController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=AppPublic)
def update(item_in: AppUpdate, controller: AppController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: AppController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[AppPublic])
def query(query: PaginationQuery, controller: AppController = Depends()) -> Any:
    return controller.query(query)
