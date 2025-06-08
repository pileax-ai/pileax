from typing import Generic, TypeVar, Type, List, Dict, Optional
from sqlmodel import SQLModel, Session
from fastapi import HTTPException
from uuid import UUID

from app.api.repos.base_repository import BaseRepository
from app.api.models.query import PaginationQuery

ModelType = TypeVar("ModelType", bound=SQLModel)
RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)

class BaseService(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: Session, repo_cls: type[BaseRepository[ModelType]]):
        self.session = session
        self.repo = repo_cls(model, session)

    def get(self, id: UUID) -> ModelType:
        obj = self.repo.get(id)
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def save(self, obj: ModelType) -> ModelType:
        id = obj.id
        newObj = self.repo.get(id)
        if not newObj:
            return self.create(obj)
        update_dict = obj.model_dump(exclude_unset=True)
        return self.update(id, update_dict)

    def create(self, obj: ModelType) -> ModelType:
        return self.repo.create(obj)

    def update(self, id: UUID, new_data: dict) -> ModelType:
        obj = self.get(id)
        return self.repo.update(obj, new_data)

    def update_by_owner(self, owner: UUID, id: UUID, new_data: dict) -> ModelType:
        obj = self.get(id)
        self._check_owner(owner, obj)
        return self.repo.update(obj, new_data)

    def delete(self, id: UUID):
        obj = self.get(id)
        return self.repo.delete(obj)

    def delete_by_owner(self, owner: UUID, id: UUID):
        obj = self.get(id)
        self._check_owner(owner, obj)
        return self.repo.delete(obj)

    def query(self, query: PaginationQuery):
        return self.repo.query(query)

    def find_one(self, condition: Optional[Dict[str, object]] = None) -> ModelType | None:
        obj = self.repo.find_one(condition)
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def find_all(self) -> List[ModelType]:
        return self.repo.find_all()

    def find_all_by_owner(self, owner: UUID) -> List[ModelType]:
        return self.repo.find_all({"user_id": owner})

    def _check_owner(self, owner: UUID, obj: ModelType):
        if not obj:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        if getattr(obj, "user_id", None) != str(owner):
            raise HTTPException(status_code=401, detail="Access denied")
