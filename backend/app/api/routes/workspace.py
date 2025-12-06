import uuid
from typing import Any, List

from fastapi import Depends

from app.api.controllers.workspace_controller import WorkspaceController
from app.api.router import ApiRouter

from app.api.models.workspace import WorkspaceCreate, WorkspaceUpdate, WorkspacePublic

router = ApiRouter(prefix="/workspace", tags=["Workspace"])


@router.api_post("", response_model=WorkspacePublic)
def save(item_in: WorkspaceCreate, controller: WorkspaceController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=WorkspacePublic)
def get(id: uuid.UUID, controller: WorkspaceController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=WorkspacePublic)
def update(item_in: WorkspaceUpdate, controller: WorkspaceController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: WorkspaceController = Depends()) -> Any:
    return controller.delete(id)


@router.api_get("/workspaces", response_model=List[WorkspacePublic])
def get_user_workspaces(controller: WorkspaceController = Depends()) -> Any:
    return controller.get_user_workspaces()
