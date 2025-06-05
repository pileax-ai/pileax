import uuid

from sqlmodel import SQLModel, Session, select
from typing import TypeVar, Generic, Type, List

ModelType = TypeVar("ModelType", bound=SQLModel)

class BaseRepository(Generic[ModelType]):
    model: Type[ModelType]

    def __init__(self, session: Session):
        self.session = session

    def get(self, id: uuid.UUID) -> ModelType | None:
        return self.session.get(self.model, id)

    def create(self, obj: ModelType) -> ModelType:
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj

    def delete(self, obj: ModelType) -> None:
        self.session.delete(obj)
        self.session.commit()

    def update(self, obj: ModelType, new_data: dict) -> ModelType:
        for key, value in new_data.items():
            setattr(obj, key, value)
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj
