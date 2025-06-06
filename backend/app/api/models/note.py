import uuid
from typing import Optional

from sqlalchemy import Column
from sqlmodel import Field

from app.api.models.common import BaseApiModel, BaseSQLModel, UUIDString, TimestampMixin


class Note(BaseSQLModel, TimestampMixin, table=True):
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), primary_key=True)
    )
    user_id: str = Field(..., max_length=64, description="Owner's ID")
    parent: str | None = Field(default=None, max_length=64, description="Parent's ID")
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
    parent: str | None = None
    title: str
    content: str
    icon: str | None = None
    cover: str | None = None
    favorite: int | None = None
    styles: str | None = None
    ref_id: str | None = None
    ref_type: str | None = None

class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    id: uuid.UUID
    title: str | None = None
    content: str | None = None


class NotePublic(NoteCreate, TimestampMixin):
    pass
