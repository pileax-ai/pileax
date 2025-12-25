import json
import uuid
import sqlalchemy as sa

from datetime import datetime, UTC
from pydantic import BaseModel, ConfigDict
from sqlalchemy import func
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
                nullable=nullable,
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
        nullable=False,
        sa_column_kwargs={
            "comment": "Created time",
            "server_default": func.now(),
        },
    )
    update_time: datetime = Field(
        nullable=False,
        sa_column_kwargs={
            "comment": "Updated time",
            "server_default": func.now(),
            "onupdate": func.now(),
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

