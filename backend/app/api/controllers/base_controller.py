from typing import Optional, TypeVar, Generic, Any, Type, List

from pydantic import BaseModel
from sqlmodel import SQLModel
from uuid import UUID

from app.api.models.query import PaginationQuery
from app.api.repos.base_repository import BaseRepository
from app.api.services.base_service import BaseService

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseController(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(
        self,
        model: Type[ModelType],
        session,
        workspace_id: Optional[UUID] = None,
        user_id: Optional[UUID] = None,
    ):
        self.model = model
        self.session = session
        self.user_id = user_id
        self.workspace_id = workspace_id
        self.service = BaseService[ModelType](model, session, BaseRepository[ModelType])

    def save(self, item_in: CreateSchemaType) -> Any:
        item = item_in.model_dump(by_alias=True)
        if hasattr(self.model, 'workspace_id') and item.get('workspace_id') is None:
            item['workspaceId'] = self.workspace_id
        if hasattr(self.model, 'user_id'):
            item['userId'] = self.user_id
        return self.service.save(self.model(**item))

    def get(self, id: UUID) -> Any:
        return self.service.get(id)

    def update(self, item_in: UpdateSchemaType) -> Any:
        return self.service.update_by_owner(
            self.user_id,
            self.workspace_id,
            item_in.id,
            item_in.model_dump(exclude_unset=True, exclude_none=True)
        )

    def delete(self, id: UUID) -> Any:
        return self.service.delete_by_owner(self.user_id, self.workspace_id, id)

    def query(self, query: PaginationQuery, filter_by_user=False) -> Any:
        if filter_by_user:
            query.condition['userId'] = self.user_id
        else:
            if query.condition.get('workspaceId') is None:
                query.condition['workspaceId'] = self.workspace_id
        return self.service.query(query)

    def find_all(self) -> List[ModelType]:
        return self.service.find_all()

    def find_all_by_owner(self) -> List[ModelType]:
        return self.service.find_all_by_owner(self.user_id)

    def find_all_by_workspace(self) -> List[ModelType]:
        return self.service.find_all({
            'workspace_id': self.workspace_id,
        })
