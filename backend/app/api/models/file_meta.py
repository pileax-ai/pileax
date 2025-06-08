import uuid

from sqlalchemy import Column
from sqlmodel import Field

from app.api.models.common import BaseApiModel, BaseSQLModel, UUIDString, TimestampMixin


class FileMeta(BaseSQLModel, TimestampMixin, table=True):
    __tablename__ = "file_meta"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), primary_key=True)
    )
    user_id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(UUIDString(), nullable=False)
    )
    mimetype: str | None = Field(default="")
    size: int | None = Field(default=0, ge=0)
    original_name: str | None = Field(default="")
    file_name: str | None = Field(default="")
    url: str | None = Field(default="")
    path: str | None = Field(default="")
    ref_id: str | None = Field(default=None)
    ref_type: str | None = Field(default="general")
    status: int | None = Field(default=1)


class FileMetaBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    mimetype: str | None = Field(default="")
    size: int | None = Field(default=0, ge=0)
    original_name: str | None = Field(default="")
    file_name: str | None = Field(default="")
    url: str | None = Field(default="")
    path: str | None = Field(default="")
    ref_id: str | None = Field(default=None)
    ref_type: str | None = Field(default="general")
    status: int | None = Field(default=0)


class FileMetaCreate(FileMetaBase):
    pass


class FileMetaUpdate(BaseApiModel):
    id: uuid.UUID
    status: int | None = Field(default=0)


class FileMetaPublic(FileMetaCreate, TimestampMixin):
    pass
