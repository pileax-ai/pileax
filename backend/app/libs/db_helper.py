from typing import Any, List, Optional, Type, Dict
from sqlmodel import SQLModel, func
from sqlalchemy.sql.elements import BinaryExpression

from app.api.models.query import SortOrder
from app.libs.helper import StringHelper


class DbHelper:
    @staticmethod
    def get_filters(
        model: Type[SQLModel],
        condition: Optional[Dict[str, Any]],
        fields: Optional[List[str]] = None
    ) -> List[BinaryExpression]:
        """
        Get filters for a SQLModel.
        :param model: Model
        :param fields: Filter fields, all fields if empty
        :param condition: Condition dictionary
        :return: List[BinaryExpression]
        """
        filters: List[BinaryExpression] = []

        if not condition:
            return filters

        for raw_field, value in condition.items():
            # value is required
            if value is None or (isinstance(value, str) and value.strip() == ""):
                continue

            if "__" in raw_field:
                field, op = raw_field.split("__", 1)
            else:
                field, op = raw_field, "eq"

            if not hasattr(model, field):
                continue

            if fields and field not in fields:
                continue

            column = getattr(model, field, None)
            if column is None:
                continue

            # Operations: Basic comparison
            simple_ops = {
                "eq": column == value,
                "ne": column != value,
                "gt": column > value,
                "lt": column < value,
                "ge": column >= value,
                "le": column <= value,
                "like": column.op("GLOB")(f"*{value}*"),
                "contains": column.op("GLOB")(f"*{value}*"),
                "startswith": column.op("GLOB")(f"{value}*"),
            }

            # Operations: Case-insensitive string match
            icase_ops = {
                "icontains": func.lower(column).contains(str(value).lower()),
                "istartswith": func.lower(column).startswith(str(value).lower()),
            }

            # Operations: IN / NOT IN support
            list_ops = {
                "in": column.in_(value if isinstance(value, (list, tuple, set)) else [value]),
                "notin": ~column.in_(value if isinstance(value, (list, tuple, set)) else [value]),
            }

            # All supported ops
            all_ops = {**simple_ops, **icase_ops, **list_ops}

            if op in all_ops:
                filters.append(all_ops[op])

        return filters

    @staticmethod
    def build_filters(
        field_mapping: Dict[Type[SQLModel], Optional[List[str]]],
        condition: Optional[Dict[str, Any]]
    ):
        """
        Build multiple table filters.

        :param condition: {"tenant_id": "xxx", "name": "Alice"}
        :param field_mapping: {TenantMember: ["tenant_id"], User: ["name"]}
        :return: SQLAlchemy filter
        """
        filters: List[BinaryExpression] = []
        for model, fields in field_mapping.items():
            filters += DbHelper.get_filters(model, condition, fields)
        return filters

    @staticmethod
    def apply_sort(
        stmt,
        models: List[Type[SQLModel]],
        sort: Optional[Dict[str, SortOrder]]
    ):
        """
        Sort, like {"user.name": "asc", "tenant.created_at": "desc"}
        """
        if not sort:
            return stmt

        # Build column mapping, like {"user.name": User.name, "tenant.name": Tenant.name}
        columns_map = {}
        for model in models:
            model_prefix = model.__name__.lower()
            for col in model.__table__.columns:
                columns_map[col.name] = getattr(model, col.name)
                columns_map[f"{model_prefix}.{col.name}"] = getattr(model, col.name)

        for field, direction in sort.items():
            field_snake = StringHelper.to_snake(field)
            column = columns_map.get(field) or columns_map.get(field_snake)
            if column:
                stmt = stmt.order_by(column.desc() if direction == "desc" else column.asc())
        return stmt

    @staticmethod
    def apply_pagination(stmt, page_index: int, page_size: int):
        offset = (page_index - 1) * page_size
        return stmt.offset(offset).limit(page_size)
