import uuid

from sqlmodel import SQLModel, Session, select, func
from typing import TypeVar, Generic, Type, List, Dict, Optional, cast

from app.api.models.query import PaginationQuery, QueryResult
from app.libs.db_helper import DbHelper

ModelType = TypeVar("ModelType", bound=SQLModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: Session):
        self.model = model
        self.session = session

    def get(self, id: uuid.UUID) -> ModelType | None:
        return self.session.get(self.model, id)

    def create(self, obj: ModelType) -> ModelType:
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj

    def delete(self, obj: ModelType) -> None:
        self.session.delete(obj)
        self.session.commit()

    def update(self, obj: ModelType, new_data: dict) -> ModelType:
        for key, value in new_data.items():
            setattr(obj, key, value)
        self.session.add(obj)
        self.session.commit()
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

    def find_one(self, condition: Optional[Dict[str, object]] = None) -> ModelType | None:
        stmt = select(self.model)

        if condition:
            for field, value in condition.items():
                if hasattr(self.model, field):
                    stmt = stmt.where(getattr(self.model, field) == value)

        return self.session.exec(stmt).first()

    def find_all(self, condition: Optional[Dict[str, object]] = None) -> List[ModelType]:
        stmt = select(self.model)

        if condition:
            for field, value in condition.items():
                if hasattr(self.model, field):
                    stmt = stmt.where(getattr(self.model, field) == value)

        rows = self.session.exec(stmt).all()
        return cast(List[ModelType], rows)
