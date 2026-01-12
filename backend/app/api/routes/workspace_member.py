import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.workspace_member_controller import WorkspaceMemberController
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_member import WorkspaceMemberInvite, WorkspaceMemberPublic, WorkspaceMemberPublicDetails
from app.api.router import ApiRouter

router = ApiRouter(prefix="/workspace/member", tags=["WorkspaceMember"])


@router.api_post("/invite", response_model=WorkspaceMemberPublic)
def invite(item_in: WorkspaceMemberInvite, controller: WorkspaceMemberController = Depends()) -> Any:
    return controller.invite(item_in)


@router.api_post("/accept", response_model=WorkspaceMemberPublic)
def accept(id: uuid.UUID, controller: WorkspaceMemberController = Depends()) -> Any:
    return controller.accept(id)


@router.api_get("/details", response_model=WorkspaceMemberPublicDetails)
def get_details(id: uuid.UUID, controller: WorkspaceMemberController = Depends()) -> Any:
    return controller.get_details(id)


@router.api_post("/query/details", response_model=QueryResult[WorkspaceMemberPublicDetails])
def query_details(query: PaginationQuery, controller: WorkspaceMemberController = Depends()) -> Any:
    return controller.query_details(query)
