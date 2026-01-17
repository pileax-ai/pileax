import uuid

from sqlmodel import Column, Field, Integer

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field
from app.api.models.enums import Status


class FileMeta(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "file_meta"

    workspace_id: uuid.UUID = uuid_field()
    user_id: uuid.UUID = uuid_field()
    mimetype: str | None = Field(default="")
    size: int | None = Field(default=0, ge=0)
    original_name: str | None = Field(default="")
    file_name: str | None = Field(default="")
    url: str | None = Field(default="")
    path: str | None = Field(default="")
    ref_id: str | None = Field(default=None)
    ref_type: str | None = Field(default="general")
    status: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))


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
    status: int | None = Field(default=1)


class FileMetaCreate(FileMetaBase):
    pass


class FileMetaUpdate(BaseApiModel):
    id: uuid.UUID
    status: int | None = Field(default=0)


class FileMetaPublic(FileMetaCreate, BaseMixin):
    workspace_id: uuid.UUID
    pass
