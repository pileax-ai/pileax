import uuid

from sqlalchemy import Column, LargeBinary
from sqlmodel import Field

from app.api.models.base import BaseMixin, BaseSQLModel, uuid_field, JSONString, BaseApiModel


class NoteVersion(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "note_version"

    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    note_id: uuid.UUID = uuid_field()
    doc: bytes = Field(
        sa_column=Column(LargeBinary),
        description="Yjs snapshot binary state"
    ),
    type: str = Field(description="snapshot, auto")
    remarks: str | None = Field(default=None)


class NoteVersionBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    parent: uuid.UUID | None = None
    icon: str | None = None
    cover: str | None = None
    favorite: int | None = None
    styles: str | None = None
    ref_id: str | None = None
    ref_type: str | None = None


class NoteVersionCreate(NoteVersionBase):
    title: str | None = None
    content: str | None = None


class NoteVersionUpdate(NoteVersionBase):
    id: uuid.UUID
    title: str | None = None
    content: str | None = None


class NoteVersionPublic(NoteVersionCreate, BaseMixin):
    workspace_id: uuid.UUID
    pass
