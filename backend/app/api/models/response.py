from typing import Generic, TypeVar, Optional, Any
from http import HTTPStatus
from pydantic import Field, BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")


class Response(GenericModel, Generic[T]):
    code: int = Field(default=0)
    message: str = Field(default="ok")
    data: Optional[T] = None


def send_ok(data: T = None, message: str = "ok", code: int = HTTPStatus.OK) -> Response[T]:
    if isinstance(data, BaseModel):
        data = data.model_dump(by_alias=True)
    return Response[T](code=code, message=message, data=data)


def send_error(message: str = "error", code: int = HTTPStatus.BAD_REQUEST, data: T = None) -> Response[T]:
    if isinstance(data, BaseModel):
        data = data.model_dump(by_alias=True)
    return Response[T](code=code, message=message, data=data)
