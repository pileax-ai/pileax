import uuid

from sqlalchemy import UniqueConstraint
from sqlmodel import Field

from app.api.models.base import BaseApiModel, BaseMixin, BaseSQLModel, uuid_field


class BookTag(BaseSQLModel, BaseMixin, table=True):
    __tablename__ = "book_tag"
    __table_args__ = (UniqueConstraint("user_id", "book_id", "tag_id", name="unique_user_book_tag"),)

    user_id: uuid.UUID = uuid_field()
    book_id: uuid.UUID = uuid_field()
    tag_id: uuid.UUID = uuid_field()


class BookTagBase(BaseApiModel):
    id: uuid.UUID | None = Field(default_factory=uuid.uuid4)
    user_id: uuid.UUID | None = None
    book_id: uuid.UUID | None = None
    tag_id: uuid.UUID | None = None


class BookTagCreate(BookTagBase):
    pass


class BookTagUpdate(BookTagBase):
    id: uuid.UUID


class BookTagPublic(BookTagCreate, BaseMixin):
    pass
