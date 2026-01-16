import uuid
from typing import Any, Generic, Optional, TypeVar, cast

from sqlalchemy import delete, exists
from sqlmodel import Session, SQLModel, func, select

from app.api.models.query import PaginationQuery, QueryResult
from app.libs.db_helper import DbHelper

ModelType = TypeVar("ModelType", bound=SQLModel)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: type[ModelType], session: Session):
        self.model = model
        self.session = session

    def get(self, id: uuid.UUID) -> ModelType | None:
        return self.session.get(self.model, id)

    def create(self, obj: ModelType, commit: bool = True) -> ModelType:
        self.session.add(obj)

        if commit:
            self.session.commit()
            try:
                self.session.refresh(obj)
            except:
                self.session.flush()
                self.session.refresh(obj)
        else:
            self.session.flush()
            self.session.refresh(obj)

        return obj

    def delete(self, obj: ModelType) -> None:
        self.session.delete(obj)
        self.session.commit()

    def update(self, obj: ModelType, new_data: dict, commit: bool = True) -> ModelType:
        for key, value in new_data.items():
            setattr(obj, key, value)
        self.session.add(obj)

        if commit:
            self.session.commit()
            try:
                self.session.refresh(obj)
            except:
                self.session.flush()
                self.session.refresh(obj)
        else:
            self.session.flush()
            self.session.refresh(obj)

        return obj

    def update_obj(self, obj: ModelType, commit: bool = True) -> ModelType:
        self.session.add(obj)

        if commit:
            self.session.commit()
            try:
                self.session.refresh(obj)
            except:
                self.session.flush()
                self.session.refresh(obj)
        else:
            self.session.flush()
            self.session.refresh(obj)

        return obj

    """
    Pagination query
    """

    def query(self, query: PaginationQuery) -> QueryResult[ModelType]:
        # 1. Basic Filter
        filters = DbHelper.get_filters(self.model, query.condition)

        # 2. stmt
        stmt = select(self.model)
        count_stmt = select(func.count()).select_from(self.model)
        if filters:
            stmt = stmt.where(*filters)
            count_stmt = count_stmt.where(*filters)

        # 3. Sort
        stmt = DbHelper.apply_sort(stmt, [self.model], query.sort)

        # 4. Pagination
        stmt = DbHelper.apply_pagination(stmt, query.pageIndex, query.pageSize)

        # 5. Query
        total = self.session.exec(count_stmt).one()
        rows = self.session.exec(stmt).all()

        return QueryResult[ModelType](
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def find_one(self, condition: Optional[dict[str, object]] = None) -> ModelType | None:
        stmt = select(self.model)

        if condition:
            for field, value in condition.items():
                if hasattr(self.model, field):
                    stmt = stmt.where(getattr(self.model, field) == value)

        return self.session.exec(stmt).first()

    def find_all(self, condition: Optional[dict[str, object]] = None) -> list[ModelType]:
        stmt = select(self.model)

        if condition:
            for field, value in condition.items():
                if hasattr(self.model, field):
                    stmt = stmt.where(getattr(self.model, field) == value)

        rows = self.session.exec(stmt).all()
        return cast(list[ModelType], rows)

    def delete_all(self, condition: dict[str, Any]) -> int:
        """
        Batch delete by condition
        :return: Row count
        """
        stmt = delete(self.model)

        if condition:
            for field, value in condition.items():
                if hasattr(self.model, field):
                    stmt = stmt.where(getattr(self.model, field) == value)

        # Avoid deleting all
        if not stmt._where_criteria:
            return 0

        result = self.session.exec(stmt)
        self.session.commit()
        return getattr(result, "rowcount", 0) or 0

    def exists(self, **filters: Any) -> bool:
        conditions = []
        for k, v in filters.items():
            if not hasattr(self.model, k):
                continue
            conditions.append(getattr(self.model, k) == v)

        if not conditions:
            return False

        stmt = select(exists().where(*conditions))
        result = self.session.exec(stmt)
        return result.one()
