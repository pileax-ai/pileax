import uuid

from sqlmodel import Column, Field, Integer

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field
from app.api.models.enums import Status


class Conversation(BaseSQLModel, BaseMixin, table=True):
    app_id: uuid.UUID = uuid_field()
    model_provider: str | None = Field(default=None)
    model_name: str | None = Field(default=None)
    model_type: str | None = Field(default=None)
    name: str = Field(..., max_length=255)
    favorite: int = Field(default=Status.PENDING, sa_column=Column(Integer, default=Status.PENDING))
    status: int = Field(default=Status.ACTIVE, sa_column=Column(Integer, default=Status.ACTIVE))


class ConversationBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    name: str | None = None
    model_provider: str | None = None
    model_name: str | None = None
    model_type: str | None = None


class ConversationCreate(ConversationBase):
    app_id: uuid.UUID | None = None


class ConversationUpdate(ConversationBase):
    id: uuid.UUID


class ConversationPublic(ConversationCreate, BaseMixin):
    pass
