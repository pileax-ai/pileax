import re
import uuid
from datetime import datetime, UTC
from sqlalchemy.types import TypeDecorator, CHAR
from sqlmodel import SQLModel, Field


def to_camel(string: str) -> str:
    return re.sub(r'_([a-z])', lambda m: m.group(1).upper(), string)


class UUIDString(TypeDecorator):
    impl = CHAR(36)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return str(value)  # 带短横
        return str(uuid.UUID(value))

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return uuid.UUID(value)


class TimestampMixin:
    create_time: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
        sa_column_kwargs={"comment": "创建时间"}
    )
    update_time: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        nullable=False,
        sa_column_kwargs={"comment": "更新时间"}
    )


class BaseSQLModel(SQLModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True
