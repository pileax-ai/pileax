import re
from collections import OrderedDict
from typing import Any, Optional

from pypinyin import Style, pinyin
from pypinyin.core import lazy_pinyin
from sqlalchemy.sql.elements import BinaryExpression
from sqlmodel import SQLModel, func, or_

from app.api.models.query import SortOrder
from app.libs.helper import StringHelper


class DbHelper:
    @staticmethod
    def get_filters(
        model: type[SQLModel], condition: Optional[dict[str, Any]], fields: Optional[list[str]] = None
    ) -> list[BinaryExpression]:
        """
        Get filters for a SQLModel.
        :param model: Model
        :param fields: Filter fields, all fields if empty
        :param condition: Condition dictionary
        :return: List[BinaryExpression]
        """
        filters: list[BinaryExpression] = []

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

            field = StringHelper.to_snake(field)
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
    def build_filters(field_mapping: dict[type[SQLModel], Optional[list[str]]], condition: Optional[dict[str, Any]]):
        """
        Build multiple table filters.

        :param condition: {"tenant_id": "xxx", "name": "Alice"}
        :param field_mapping: {TenantMember: ["tenant_id"], User: ["name"]}
        :return: SQLAlchemy filter
        """
        filters: list[BinaryExpression] = []
        for model, fields in field_mapping.items():
            filters += DbHelper.get_filters(model, condition, fields)
        return filters

    @staticmethod
    def build_or_filters(
        field_mapping: dict[type[SQLModel], Optional[list[str]]], or_condition: Optional[dict[str, Any]]
    ) -> Optional[BinaryExpression]:
        """
        Build OR filters from a flat dictionary of conditions.
        All conditions inside this dictionary will be combined using SQLAlchemy's or_().
        """
        if not or_condition or not isinstance(or_condition, dict):
            return None

        or_filters: list[BinaryExpression] = []
        for model, fields in field_mapping.items():
            # Gather all sub-filters that belong to the OR condition
            or_filters += DbHelper.get_filters(model, or_condition, fields)

        # Wrap with or_() if any filters are matched
        return or_(*or_filters) if or_filters else None

    @staticmethod
    def apply_sort(stmt, models: list[type[SQLModel]], sort: Optional[dict[str, SortOrder]]):
        """
        Sort, like {"user.name": "asc", "tenant.created_at": "desc"}
        """
        if not sort:
            return stmt

        # Build column mapping, like {"user.name": User.name, "tenant.name": Tenant.name}
        columns_map = OrderedDict()
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

    @staticmethod
    def parse_json_fields(data: dict, fields: list[str]):
        import json

        for f in fields:
            if isinstance(data.get(f), str):
                try:
                    data[f] = json.loads(data[f])
                except:
                    data[f] = None
        return data

    @staticmethod
    def to_pinyin(s):
        return "".join(lazy_pinyin(s or ""))

    @staticmethod
    def is_pinyin(text: str) -> bool:
        """
        Strictly determine if the text is valid Mandarin pinyin.
        """
        if not text:
            return False

        # Standardize input to lowercase and remove spaces
        clean_text = text.lower().replace(" ", "")

        # 1. Quick check if it contains any non-english characters
        if not re.match(r"^[a-z]+$", clean_text):
            return False

        # 2. Use pypinyin to see if the library can parse it as normal pinyin
        # Note: If it's already pinyin, pypinyin typically returns it as-is
        parsed = pinyin(clean_text, style=Style.NORMAL)
        flat_parsed = "".join([item[0] for item in parsed])

        return flat_parsed == clean_text
