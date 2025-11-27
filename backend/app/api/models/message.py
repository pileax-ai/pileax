import uuid

from sqlmodel import Column, Field, Integer

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field
from app.api.models.enums import Status


class Message(BaseSQLModel, BaseMixin, table=True):
    app_id: uuid.UUID = uuid_field()
    conversation_id: uuid.UUID = uuid_field()
    model_provider: str | None = Field(default=None)
    model_name: str | None = Field(default=None)
    model_type: str | None = Field(default=None)
    message: str | None = Field(default="")
    content: str | None = Field(default="")
    reasoning_content: int = Field(default=0, sa_column=Column(Integer, default=0))
    result: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))
    total_tokens: int = Field(default=0, sa_column=Column(Integer, default=0))
    favorite: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))
    status: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))


class MessageBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)


class MessageCreate(MessageBase):
    app_id: uuid.UUID | None = None
    conversation_id: uuid.UUID
    message: str | None = None
    stream: bool | None = None


class MessageUpdate(MessageBase):
    id: uuid.UUID


class MessagePublic(MessageBase, BaseMixin):
    app_id: uuid.UUID
    conversation_id: uuid.UUID
    model_provider: str | None = None
    model_name: str | None = None
    model_type: str | None = None
    message: str | None = None
    content: str | None = None
    reasoning_content: str | None = None
    result: int
    favorite: int
