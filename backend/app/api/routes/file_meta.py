import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.file_meta_controller import FileMetaController
from app.api.models.file_meta import FileMetaCreate, FileMetaPublic, FileMetaUpdate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.router import ApiRouter

router = ApiRouter(prefix="/file/meta", tags=["FileMeta"])


@router.api_post("", response_model=FileMetaPublic)
def save(item_in: FileMetaCreate, controller: FileMetaController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=FileMetaPublic)
def get(id: uuid.UUID, controller: FileMetaController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=FileMetaPublic)
def update(item_in: FileMetaUpdate, controller: FileMetaController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: FileMetaController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[FileMetaPublic])
def query(query: PaginationQuery, controller: FileMetaController = Depends()) -> Any:
    return controller.query(query)


@router.api_post("/all", response_model=list[FileMetaPublic])
def find_all(controller: FileMetaController = Depends()) -> Any:
    return controller.find_all_by_workspace()
