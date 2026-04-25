import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, Integer, text, String, UniqueConstraint
from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field, time_field
from app.api.models.enums import Status

class ShareType(enum.StrEnum):
    PRIVATE = "private"
    PUBLIC = "public"


class NoteShare(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "note_share"
    __table_args__ = (
        UniqueConstraint("share_id", name="unique_share_id"),
        UniqueConstraint("user_id", "note_id", name="unique_user_note"),
    )

    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    note_id: uuid.UUID = uuid_field()
    share_id: str = Field(..., max_length=100)
    share_type: str = Field(
        default=ShareType.PUBLIC, max_length=32, sa_column=Column(String(32), default=ShareType.PUBLIC)
    )
    password: str | None = Field(default=None)
    expire_time: datetime | None = time_field()
    is_active: int = Field(
        default=Status.ACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.ACTIVE))}
    )
    view_count: int = Field(
        default=0, sa_type=Integer, sa_column_kwargs={"server_default": text('0')}
    )


class NoteShareBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    share_id: str | None = None


class NoteShareCreate(NoteShareBase):
    note_id: uuid.UUID
    share_type: str
    password: str | None = None


class NoteShareUpdate(NoteShareBase):
    id: uuid.UUID
    is_active: int | None = None


class NoteSharePublic(NoteShareBase, BaseMixin):
    view_count: int | None = None

class NoteShareDetails(NoteSharePublic):
    title: str | None = None
    content: dict | None = None
    icon: str | None = None
    cover: str | None = None
    styles: dict | None = None
