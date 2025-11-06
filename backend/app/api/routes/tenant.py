import uuid
from typing import Any

from app.api.controllers.tenant_controller import TenantController
from app.api.router import ApiRouter

from app.api.deps import SessionDep, CurrentUserId
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.tenant import TenantCreate, TenantUpdate, TenantPublic

router = ApiRouter(prefix="/tenant", tags=["Tenant"])


@router.api_post("", response_model=TenantPublic)
def save(item_in: TenantCreate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return TenantController(session, user_id).save(item_in)


@router.api_get("", response_model=TenantPublic)
def get(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return TenantController(session, user_id).get(id)


@router.api_put("", response_model=TenantPublic)
def update(item_in: TenantUpdate, session: SessionDep, user_id: CurrentUserId) -> Any:
    return TenantController(session, user_id).update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, session: SessionDep, user_id: CurrentUserId) -> Any:
    return TenantController(session, user_id).delete(id)


@router.api_post("/query", response_model=QueryResult[TenantPublic])
def query(query: PaginationQuery, session: SessionDep, user_id: CurrentUserId) -> Any:
    return TenantController(session, user_id).query(query)
