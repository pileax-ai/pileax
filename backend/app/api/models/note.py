import uuid

from pydantic import field_validator
from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field


class Note(BaseSQLModel, BaseMixin, table=True):
    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    parent: uuid.UUID | None = uuid_field(default_none=True)
    title: str = Field(..., max_length=255, description="Note title")
    content: str = Field(..., description="Note content")
    icon: str | None = Field(default=None)
    cover: str | None = Field(default=None)
    favorite: int | None = Field(default=0, ge=0, le=1, description="Favorite: 0.no, 1.yes")
    styles: str | None = Field(default=None)
    ref_id: str | None = Field(default=None)
    ref_type: str | None = Field(default="general", description="Ref type: general, chat, book, etc.")


class NoteBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    parent: uuid.UUID | None = None
    icon: str | None = None
    cover: str | None = None
    favorite: int | None = None
    styles: str | None = None
    ref_id: str | None = None
    ref_type: str | None = None

    @field_validator("parent", mode="before")
    def parse_empty_string_as_none(cls, v):
        if v == "":
            return None
        return v


class NoteCreate(NoteBase):
    title: str | None = None
    content: str | None = None


class NoteUpdate(NoteBase):
    id: uuid.UUID
    title: str | None = None
    content: str | None = None


class NotePublic(NoteCreate, BaseMixin):
    workspace_id: uuid.UUID
    pass
