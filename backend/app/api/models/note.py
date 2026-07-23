import uuid

from pydantic import field_validator
from sqlalchemy import Column, LargeBinary
from sqlmodel import Field, Integer, text

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, JSONString, uuid_field
from app.api.models.enums import Scope


class Note(BaseSQLModel, BaseMixin, table=True):
    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    parent: uuid.UUID | None = uuid_field(default_none=True)
    title: str = Field(..., max_length=255, description="Note title")
    content: dict = Field(..., sa_type=JSONString, description="Note JSON content")
    content_markdown: str | None = Field(default=None, description="Note Markdown content")
    doc: bytes | None = Field(default=None, sa_column=Column(LargeBinary), description="Yjs binary state")
    icon: str | None = Field(default=None)
    cover: str | None = Field(default=None)
    favorite: int | None = Field(default=0, ge=0, le=1, description="Favorite: 0.no, 1.yes")
    styles: dict | None = Field(default=None, sa_type=JSONString)
    ref_id: str | None = Field(default=None)
    ref_type: str | None = Field(default="general", description="Ref type: general, chat, book, etc.")
    last_edit_by: uuid.UUID | None = uuid_field(default_none=True)
    scope: int | None = Field(
        default=Scope.OWNER, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Scope.OWNER))}
    )


class NoteBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    parent: uuid.UUID | None = None
    title: str | None = None
    content: dict | None = None
    content_markdown: str | None = None
    icon: str | None = None
    cover: str | None = None
    favorite: int | None = None
    styles: dict | None = None
    last_edit_by: uuid.UUID | None = None
    scope: int | None = Scope.OWNER

    @field_validator("parent", mode="before")
    def parse_empty_string_as_none(cls, v):
        if v == "":
            return None
        return v


class NoteCreate(NoteBase):
    doc: bytes | None = None
    content_markdown: str | None = None
    ref_id: str | None = None
    ref_type: str | None = None


class NoteUpdate(NoteBase):
    id: uuid.UUID


class NotePublic(NoteBase, BaseMixin):
    user_id: uuid.UUID
    workspace_id: uuid.UUID
    ref_id: str | None = None
    ref_type: str | None = None
    pass
