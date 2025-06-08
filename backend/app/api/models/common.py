import re
import uuid
from datetime import datetime, UTC, timezone

from pydantic import BaseModel, ConfigDict
from sqlalchemy.types import TypeDecorator, CHAR
from sqlmodel import SQLModel, Field


def to_camel(string: str) -> str:
    """
    Convert snake case string to camelCase
    """
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
    create_time: str = Field(
        default_factory=lambda: datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        nullable=False,
        sa_column_kwargs={"comment": "Created time"}
    )
    update_time: str = Field(
        default_factory=lambda: datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        nullable=False,
        sa_column_kwargs={"comment": "Updated time"}
    )


class TimestampReadMixin(BaseModel):
    create_time: datetime
    update_time: datetime

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
        }


class BaseSQLModel(SQLModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_name=True
    )


class BaseApiModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_name=True
    )
