from typing import Any, List, Optional, Type, Dict
from sqlmodel import SQLModel, func
from sqlalchemy.sql.elements import BinaryExpression

class DbUtil:
    @staticmethod
    def get_filters(model: Type[SQLModel], condition: Optional[Dict[str, Any]], fields: Optional[List[str]] = None) -> List[BinaryExpression]:
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

            if not hasattr(model, raw_field):
                continue

            if fields and field not in fields:
                continue

            column = getattr(model, field, None)
            if column is None:
                continue

            # Operations
            simple_ops = {
                "eq": column == value,
                "ne": column != value,
                "gt": column > value,
                "lt": column < value,
                "ge": column >= value,
                "le": column <= value,
                # "contains": column.contains(value),
                # "startswith": column.startswith(value),
                "contains": column.op("GLOB")(f"*{value}*"),
                "startswith": column.op("GLOB")(f"{value}*"),
            }

            icase_ops = {
                "icontains": func.lower(column).contains(str(value).lower()),
                "istartswith": func.lower(column).startswith(str(value).lower()),
            }

            if op in simple_ops:
                filters.append(simple_ops[op])
            elif op in icase_ops:
                filters.append(icase_ops[op])

        return filters
