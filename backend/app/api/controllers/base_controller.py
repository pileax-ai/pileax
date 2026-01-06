from typing import Any, Generic, Optional, TypeVar
from uuid import UUID

from pydantic import BaseModel
from sqlmodel import SQLModel

from app.api.models.owner import Owner
from app.api.models.query import PaginationQuery
from app.api.models.workspace import Workspace
from app.api.repos.base_repository import BaseRepository
from app.api.services.base_service import BaseService

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseController(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(
        self,
        model: type[ModelType],
        session,
        user_id: Optional[UUID] = None,
        workspace_id: Optional[UUID] = None,
        workspace: Optional[Workspace] = None,
    ):
        self.model = model
        self.session = session
        self.user_id = user_id
        self.workspace_id = workspace_id
        self.workspace = workspace
        self.service = BaseService[ModelType](model, session, BaseRepository[ModelType])

    def save(self, item_in: CreateSchemaType) -> Any:
        item = item_in.model_dump(by_alias=True)
        if hasattr(self.model, "tenant_id") and item.get("tenant_id") is None:
            if self.workspace:
                item["tenant_id"] = self.workspace.tenant_id
        if hasattr(self.model, "workspace_id") and item.get("workspace_id") is None:
            item["workspaceId"] = self.workspace_id
        if hasattr(self.model, "user_id"):
            item["userId"] = self.user_id
        return self.service.save(self.model(**item))

    def get(self, id: UUID) -> Any:
        return self.service.get(id)

    def update(self, item_in: UpdateSchemaType) -> Any:
        return self.service.update_by_owner(
            Owner(workspace_id=self.workspace_id, user_id=self.user_id),
            item_in.id,
            item_in.model_dump(exclude_unset=True, exclude_none=True),
        )

    def update_by_user(self, item_in: UpdateSchemaType) -> Any:
        return self.service.update_by_owner(
            Owner(user_id=self.user_id), item_in.id, item_in.model_dump(exclude_unset=True, exclude_none=True)
        )

    def delete(self, id: UUID) -> Any:
        return self.service.delete_by_owner(Owner(workspace_id=self.workspace_id, user_id=self.user_id), id)

    def query(self, query: PaginationQuery, filter_by_user=False, filter_by_workspace=True) -> Any:
        if filter_by_user and query.condition.get("userId") is None:
            query.condition["userId"] = self.user_id

        if filter_by_workspace and hasattr(self.model, "workspace_id") and query.condition.get("workspaceId") is None:
            query.condition["workspaceId"] = self.workspace_id

        return self.service.query(query)

    def query_by_tenant(self, query: PaginationQuery) -> Any:
        if hasattr(self.model, "tenant_id") and self.workspace:
            query.condition["tenantId"] = self.workspace.tenant_id
        return self.service.query(query)

    def find_all(self, condition: Optional[dict[str, object]] = None) -> list[ModelType]:
        return self.service.find_all(condition)

    def find_all_by_workspace(self) -> list[ModelType]:
        return self.service.find_all(
            {
                "workspace_id": self.workspace_id,
            }
        )
