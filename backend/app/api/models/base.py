import json
import uuid
from typing import Any, Union

import sqlalchemy as sa

from datetime import datetime, UTC

from fastapi._compat import UndefinedType, Undefined
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import declared_attr, Mapped, mapped_column
from sqlalchemy.types import TypeDecorator, CHAR, BINARY
from sqlmodel import SQLModel, Field, TEXT

from app.libs.helper import StringHelper


class UUIDString(TypeDecorator):
    """
    UUID field
    """
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


class JSONString(TypeDecorator):
    """
    JSON field
    """
    impl = TEXT

    def process_bind_param(self, value, dialect):
        return json.dumps(value) if isinstance(value, dict) else value

    def process_result_value(self, value, dialect):
        return json.loads(value) if value else {}


class GUID(TypeDecorator):
    """
    Platform-independent UUID type.

    PostgreSQL: UUID
    MySQL:      BINARY(16)
    SQLite:    CHAR(36)
    """
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(sa.UUID())
        if dialect.name == "mysql":
            return dialect.type_descriptor(BINARY(16))
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        if not isinstance(value, uuid.UUID):
            value = uuid.UUID(str(value))
        if dialect.name == "mysql":
            return value.bytes
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if dialect.name == "mysql":
            return uuid.UUID(bytes=value)
        return uuid.UUID(value)


def uuid_field(
    *,
    nullable: bool = False,
    unique: bool = False,
    primary_key: bool = False,
    default_none: bool = False,
):
    if default_none:
        return Field(
            default=None,
            sa_column=sa.Column(
                GUID(),
                nullable=True,
                unique=unique,
                primary_key=primary_key,
            ),
        )

    return Field(
        default_factory=uuid.uuid4,
        sa_column=sa.Column(
            GUID(),
            nullable=nullable,
            unique=unique,
            primary_key=primary_key,
        ),
    )


def utc_now():
    return datetime.now(UTC)


def time_field(
    *,
    nullable: Union[bool, UndefinedType] = True,
    comment: str | None = None
):
    return Field(
        default_factory=utc_now if not nullable else None,
        nullable=nullable,
        sa_column_kwargs={
            "comment": comment,
        } if comment else {},
    )


class BaseSQLModel(SQLModel):
    model_config = ConfigDict(
        alias_generator=StringHelper.to_camel,
        validate_by_name=True,
        arbitrary_types_allowed=True,
    )


class BaseApiModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=StringHelper.to_camel,
        validate_by_name=True,
        from_attributes=True
    )



class TimestampMixin:
    create_time: datetime = Field(
        default_factory=utc_now,
        nullable=False,
        sa_column_kwargs={"comment": "Created time",},
    )
    update_time: datetime = Field(
        default_factory=utc_now,
        nullable=False,
        sa_column_kwargs={"comment": "Updated time",},
    )


class BaseMixin(TimestampMixin):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        unique=True,
        nullable=False,
        sa_type=GUID,
        sa_column_kwargs={"primary_key": True, "unique": True},
    )

