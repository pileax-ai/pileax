import base64
import uuid
import zlib
from typing import Any

from pydantic import field_validator, field_serializer
from sqlalchemy import Column, LargeBinary, Index
from sqlmodel import Field

from app.api.models.base import BaseMixin, BaseSQLModel, uuid_field, BaseApiModel, JSONString


class NoteVersion(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "note_version"
    __table_args__ = (
        Index("idx_note_version_note_id", "note_id"),
    )

    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    note_id: uuid.UUID = uuid_field()
    content: dict | None = Field(default=None, sa_type=JSONString, description="Note JSON content")
    doc: bytes | None = Field(
        default=None,
        sa_column=Column(LargeBinary),
        description="Yjs update binary state"
    )
    title: str | None = Field(default=None, max_length=255, description="Note title")
    icon: str | None = Field(default=None)
    cover: str | None = Field(default=None)
    styles: dict | None = Field(default=None, sa_type=JSONString)
    type: str = Field(description="update, full, milestone")
    remarks: str | None = Field(default=None)


class NoteVersionBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    note_id: uuid.UUID
    title: str | None = None
    icon: str | None = None
    cover: str | None = None
    styles: str | None = None
    type: str | None = None
    remarks: str | None = None


class NoteVersionCreate(NoteVersionBase):
    type: str
    content: dict | None = None
    doc: bytes | None = None

    @field_validator('doc', mode='before')
    @classmethod
    def validate_doc(cls, v: Any) -> bytes | None:
        raw_data = v

        if v is None:
            return None

        # Base64 string
        if isinstance(v, str):
            try:
                raw_data = base64.b64decode(v)
            except Exception:
                raise ValueError("Invalid base64 encoding")

            # Size limit
            max_size = 10 * 1024 * 1024  # 10MB
            if len(raw_data) > max_size:
                raise ValueError(f"Document size exceeds limit of {max_size} bytes")

        # Bytes
        if not isinstance(raw_data, (bytes, bytearray)):
            raise ValueError(f"Document needs to be bytes or bytearray")

        return raw_data


class NoteVersionUpdate(NoteVersionBase):
    id: uuid.UUID


class NoteVersionPublic(NoteVersionCreate, BaseMixin):
    @field_serializer('doc')
    def serialize_doc(self, v: bytes) -> str | None:
        if v is None:
            return None

        return base64.b64encode(v).decode('utf-8')


class NoteVersionDetails(NoteVersionPublic):
    user_name: str
    user_avatar: str | None
