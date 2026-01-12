import json
import uuid
from datetime import UTC, datetime
from typing import Union

import sqlalchemy as sa
from fastapi._compat import UndefinedType
from pydantic import BaseModel, ConfigDict
from sqlalchemy.dialects import mysql, postgresql
from sqlalchemy.types import BINARY, CHAR, TypeDecorator
from sqlmodel import TEXT, Field, SQLModel

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
    Cross-database JSON type.

    - PostgreSQL: JSONB
    - MySQL: JSON
    - SQLite: TEXT
    """

    cache_ok = True
    impl = TEXT

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(postgresql.JSONB())
        if dialect.name == "mysql":
            return dialect.type_descriptor(mysql.JSON())
        return dialect.type_descriptor(TEXT())

    def process_bind_param(self, value, dialect):
        if value is None:
            return None

        # Postgres / MySQL
        if dialect.name in ("postgresql", "mysql"):
            return value

        # SQLite
        if isinstance(value, (dict, list)):
            return json.dumps(value, ensure_ascii=False)

        raise ValueError(f"Invalid JSON value: {value!r}")

    def process_result_value(self, value, dialect):
        if value is None:
            return None

        if dialect.name in ("postgresql", "mysql"):
            return value

        # SQLite
        return json.loads(value)


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
        if dialect.name == "postgresql":
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, uuid.UUID):
            return value
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


def time_field(*, nullable: Union[bool, UndefinedType] = True, comment: str | None = None):
    return Field(
        default_factory=utc_now if not nullable else None,
        nullable=nullable,
        sa_column_kwargs={
            "comment": comment,
        }
        if comment
        else {},
    )


class BaseSQLModel(SQLModel):
    model_config = ConfigDict(
        alias_generator=StringHelper.to_camel,
        validate_by_name=True,
        arbitrary_types_allowed=True,
    )


class BaseApiModel(BaseModel):
    model_config = ConfigDict(alias_generator=StringHelper.to_camel, validate_by_name=True, from_attributes=True)


class TimestampMixin:
    create_time: datetime = Field(
        default_factory=utc_now,
        nullable=False,
        sa_column_kwargs={
            "comment": "Created time",
        },
    )
    update_time: datetime = Field(
        default_factory=utc_now,
        nullable=False,
        sa_column_kwargs={
            "comment": "Updated time",
        },
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
