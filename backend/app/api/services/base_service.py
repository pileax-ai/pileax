from typing import Any, Generic, Optional, TypeVar
from uuid import UUID

from fastapi import HTTPException, status
from sqlmodel import Session, SQLModel

from app.api.models.owner import Owner
from app.api.models.query import PaginationQuery, SortOrder
from app.api.repos.base_repository import BaseRepository
from app.libs.exception.business_error import BusinessError

ModelType = TypeVar("ModelType", bound=SQLModel)
RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)


class BaseService(Generic[ModelType]):
    def __init__(self, model: type[ModelType], session: Session, repo_cls: type[BaseRepository[ModelType]]):
        self.session = session
        self.repo = repo_cls(model, session)

    def get(self, id: UUID, raise_exception=True) -> ModelType:
        obj = self.repo.get(id)
        if not obj and raise_exception:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def get_by_owner(self, owner: Owner, id: UUID, raise_exception=True) -> ModelType:
        obj = self.repo.get(id)
        self.check_read_permission(owner, obj, raise_exception)
        return obj

    def save(self, obj: ModelType, commit: bool = True) -> ModelType:
        id = obj.id
        newObj = self.repo.get(id)
        if not newObj:
            return self.create(obj, commit)
        update_dict = obj.model_dump(exclude_unset=True, exclude_none=True, exclude_defaults=True)
        return self.update(id, update_dict, commit)

    def create(self, obj: ModelType, commit: bool = True) -> ModelType:
        return self.repo.create(obj, commit)

    def update(self, id: UUID, new_data: dict, commit: bool = True) -> ModelType:
        obj = self.get(id)
        return self.repo.update(obj, new_data, commit)

    def update_by_owner(self, ower: Owner, id: UUID, new_data: dict, commit: bool = True) -> ModelType:
        obj = self.get(id)
        self.check_owner(ower, obj)
        return self.repo.update(obj, new_data, commit)

    def delete(self, id: UUID):
        obj = self.get(id)
        return self.repo.delete(obj)

    def delete_by_owner(self, ower: Owner, id: UUID, raise_exception=True):
        obj = self.get(id)
        self.check_owner(ower, obj, raise_exception)
        return self.repo.delete(obj)

    def query(self, query: PaginationQuery):
        return self.repo.query(query)

    def find_one(
        self,
        condition: Optional[dict[str, object]] = None,
        sort: Optional[dict[str, SortOrder]] = None,
        raise_exception=False,
    ) -> ModelType | None:
        obj = self.repo.find_one(condition, sort)
        if not obj and raise_exception:
            raise HTTPException(status_code=404, detail=f"{self.repo.model.__name__} not found")
        return obj

    def find_all(self, condition: Optional[dict[str, object]] = None) -> list[ModelType]:
        return self.repo.find_all(condition)

    def delete_all(self, condition: dict[str, Any]) -> int:
        return self.repo.delete_all(condition)

    def exists(self, **filters: Any) -> bool:
        return self.repo.exists(**filters)

    def check_owner(self, owner: Owner, obj: ModelType, raise_exception=True):
        if not obj:
            if raise_exception:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"{self.repo.model.__name__} not found"
                )
            else:
                return False

        if owner.tenant_id and hasattr(obj, "tenant_id") and str(obj.tenant_id) != str(owner.tenant_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

        if owner.workspace_id and hasattr(obj, "workspace_id") and str(obj.workspace_id) != str(owner.workspace_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

        if owner.user_id and hasattr(obj, "user_id") and str(obj.user_id) != str(owner.user_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    def check_read_permission(self, owner: Owner, obj: ModelType, raise_exception=True) -> bool:
        """
        Check if owner has read permission
        workspace or user
        """
        if not obj:
            if raise_exception:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"{self.repo.model.__name__} not found"
                )
            else:
                return True

        owner_workspace_id = owner.workspace.id if owner.workspace else owner.workspace_id
        obj_workspace_id = obj.workspace_id if hasattr(obj, "workspace_id") else None
        if obj_workspace_id and owner_workspace_id:
            if owner_workspace_id == obj_workspace_id:
                return True
            else:
                raise BusinessError(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access denied",
                    data={"type": "workspace", "message": "Not workspace member", "location": "service"},
                )

        if owner.user_id and hasattr(obj, "user_id") and str(obj.user_id) == str(owner.user_id):
            return True
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied [User]")
