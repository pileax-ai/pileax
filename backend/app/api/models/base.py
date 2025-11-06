import re
import uuid
from datetime import datetime, UTC, timezone

from pydantic import BaseModel, ConfigDict
from sqlalchemy.types import TypeDecorator, CHAR
from sqlmodel import SQLModel, Field

from app.libs.helper import StringHelper


class UUIDString(TypeDecorator):
    impl = CHAR(36)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return str(value)
        return str(uuid.UUID(value))

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return uuid.UUID(value)


class BaseSQLModel(SQLModel):
    model_config = ConfigDict(
        alias_generator=StringHelper.to_camel,
        validate_by_name=True
    )


class BaseApiModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=StringHelper.to_camel,
        validate_by_name=True
    )


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


class BaseMixin(TimestampMixin):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        sa_type=UUIDString,
        sa_column_kwargs={"nullable": False, "unique": True},
    )


def uuid_field(
    nullable: bool = False,
    unique: bool = False,
    primary_key: bool = False,
    default_none: bool = False,
):
    if default_none:
        return Field(default=None, sa_type=UUIDString)
    return Field(
        default_factory=uuid.uuid4,
        nullable=nullable,
        primary_key=primary_key,
        sa_type=UUIDString,
        sa_column_kwargs={"nullable": nullable, "unique": unique},
    )
