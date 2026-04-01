import uuid

from sqlalchemy import UniqueConstraint
from sqlmodel import Column, Field, Integer

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field
from app.api.models.enums import Status


class FileMeta(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "file_meta"
    __table_args__ = (UniqueConstraint("sha1", name="unique_sha1"),)

    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    sha1: str = Field(..., min_length=32, max_length=64, description="File sha1 hash")
    mimetype: str | None = Field(default="")
    size: int | None = Field(default=0, ge=0)
    original_name: str | None = Field(default="")
    file_name: str | None = Field(default="")
    url: str | None = Field(default="")
    ref_id: str | None = Field(default=None)
    ref_type: str | None = Field(default="general")
    status: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))


class FileMetaBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    sha1: str
    mimetype: str | None = Field(default="")
    size: int | None = Field(default=0, ge=0)
    original_name: str | None = Field(default="")
    file_name: str | None = Field(default="")
    url: str | None = Field(default="")
    ref_id: str | None = Field(default=None)
    ref_type: str | None = Field(default="general")
    status: int | None = Field(default=1)


class FileMetaCreate(FileMetaBase):
    pass


class FileMetaUpdate(BaseApiModel):
    id: uuid.UUID
    status: int | None = Field(default=0)


class FileMetaPublic(FileMetaCreate, BaseMixin):
    workspace_id: uuid.UUID
    pass
