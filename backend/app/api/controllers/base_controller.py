import uuid
from typing import Optional, TypeVar, Generic, Any, Type

from pydantic import BaseModel
from sqlmodel import SQLModel

from app.api.models.query import PaginationQuery
from app.api.repos.base_repository import BaseRepository
from app.api.services.base_service import BaseService

ModelType = TypeVar("ModelType", bound=SQLModel)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
PublicSchemaType = TypeVar("PublicSchemaType", bound=BaseModel)


class BaseController(Generic[ModelType, CreateSchemaType, UpdateSchemaType, PublicSchemaType]):
    def __init__(self, model: Type[ModelType], session, user_id: Optional[str] = None):
        self.model = model
        self.session = session
        self.user_id = user_id
        self.service = BaseService[ModelType](model, session, BaseRepository[ModelType])

    def save(self, item_in: CreateSchemaType) -> Any:
        item = item_in.model_dump(by_alias=True)
        item["userId"] = str(self.user_id)
        return self.service.save(self.model(**item))

    def get(self, id: uuid.UUID) -> Any:
        return self.service.get(id)

    def update(self, item_in: UpdateSchemaType) -> Any:
        return self.service.update_by_owner(
            self.user_id,
            item_in.id,
            item_in.model_dump(exclude_unset=True)
        )

    def delete(self, id: uuid.UUID) -> Any:
        return self.service.delete_by_owner(self.user_id, id)

    def query(self, query: PaginationQuery) -> Any:
        query.condition["user_id"] = str(self.user_id)
        return self.service.query(query)
