import uuid
from typing import Any, List

from app.api.controllers.file_meta_controller import FileMetaController
from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUserId
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.file_meta import FileMetaCreate, FileMetaUpdate, FileMetaPublic

router = ApiRouter(prefix="/file/meta", tags=["FileMeta"])


@router.api_post("/", response_model=FileMetaPublic)
def save(item_in: FileMetaCreate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return FileMetaController(session, user_id).save(item_in)


@router.api_get("/", response_model=FileMetaPublic)
def get(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return FileMetaController(session, user_id).get(id)


@router.api_put("/", response_model=FileMetaPublic)
def update(item_in: FileMetaUpdate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return FileMetaController(session, user_id).update(item_in)


@router.api_delete("/")
def delete(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return FileMetaController(session, user_id).delete(id)


@router.api_post("/query", response_model=QueryResult[FileMetaPublic])
def query(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return FileMetaController(session, user_id).query(query)


@router.api_post("/all", response_model=List[FileMetaPublic])
def find_all(session: SessionDep, user_id: CurrentUserId) -> Any:
    return FileMetaController(session, user_id).find_all_by_owner()
