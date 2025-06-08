import uuid

from sqlmodel import SQLModel, Session, select, func
from typing import TypeVar, Generic, Type, List, Tuple, Dict, Optional, cast

from app.api.models.query import PaginationQuery, QueryResult

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
        filters = []

        for raw_field, value in query.condition.items():
            if not value:
                continue

            if "__" in raw_field:
                field, op = raw_field.split("__", 1)
            else:
                field, op = raw_field, "eq"

            if not hasattr(self.model, field):
                continue

            column = getattr(self.model, field)

            # Operations
            if op == "eq":
                filters.append(column == value)
            elif op == "ne":
                filters.append(column != value)
            elif op == "gt":
                filters.append(column > value)
            elif op == "lt":
                filters.append(column < value)
            elif op == "ge":
                filters.append(column >= value)
            elif op == "le":
                filters.append(column <= value)
            elif op == "contains":
                filters.append(column.contains(value))
            elif op == "icontains":
                filters.append(func.lower(column).contains(value.lower()))
            elif op == "startswith":
                filters.append(column.startswith(value))
            elif op == "istartswith":
                filters.append(func.lower(column).startswith(value.lower()))

        # 2. Total
        count_stmt = select(func.count()).select_from(self.model)
        if filters:
            count_stmt = count_stmt.where(*filters)

        total = self.session.exec(count_stmt).one()

        # 3. Query Filter
        stmt = select(self.model)
        if filters:
            stmt = stmt.where(*filters)

        # 3.1 Add order
        for field, direction in query.sort.items():
            if hasattr(self.model, field):
                column = getattr(self.model, field)
                stmt = stmt.order_by(column.desc() if direction == "desc" else column.asc())

        # 4. Pagination
        offset = (query.pageIndex - 1) * query.pageSize
        stmt = stmt.offset(offset).limit(query.pageSize)

        # 5. Query
        rows = self.session.exec(stmt).all()

        return QueryResult[ModelType](
            total=total,
            list=rows,
            pageSize=query.pageSize,
            pageIndex=query.pageIndex,
        )

    def find_all(self, condition: Optional[Dict[str, object]] = None) -> List[ModelType]:
        stmt = select(self.model)

        if condition:
            for field, value in condition.items():
                if hasattr(self.model, field):
                    stmt = stmt.where(getattr(self.model, field) == value)

        rows = self.session.exec(stmt).all()
        return cast(List[ModelType], rows)
