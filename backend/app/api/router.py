import inspect
from functools import wraps
from typing import Generic, TypeVar, Optional, Any, Type, Callable
from http import HTTPStatus
from pydantic import Field, BaseModel
from fastapi import APIRouter
from starlette.responses import StreamingResponse

T = TypeVar("T")


class Response(BaseModel, Generic[T]):
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


def api_response(model: Type[T]):
    def decorator(func: Callable[..., Any]):
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Response[T]:
            result = await func(*args, **kwargs) if callable(func) and func.__code__.co_flags & 0x80 else func(*args, **kwargs)

            if isinstance(result, BaseModel):
                result = model(**result.model_dump(by_alias=True))
            # 如果是 list[BaseModel]，统一转 dict
            # elif isinstance(result, list) and result and isinstance(result[0], BaseModel):
            #     result = [model(**item.model_dump(by_alias=True)) for item in result]

            return Response(
                code=HTTPStatus.OK,
                message="ok",
                data=result
            )
        return wrapper
    return decorator


class ApiRouter(APIRouter):
    def api_get(self, path: str, response_model: Type[T], **kwargs):
        def decorator(func: Callable[..., Any]):
            return self.get(path, response_model=Response[response_model], **kwargs)(
                api_response(response_model)(func)
            )
        return decorator

    def api_post(self, path: str, response_model: Type[T], **kwargs):
        def decorator(func: Callable[..., Any]):
            @wraps(func)
            async def wrapper(*args, **inner_kwargs):
                result = func(*args, **inner_kwargs)
                if inspect.isawaitable(result):
                    result = await result

                # case 1: streaming
                if isinstance(result, StreamingResponse):
                    return result

                # case 2: general
                async def wrapped_fun():
                    return result

                wrapped = api_response(response_model)(wrapped_fun)
                return await wrapped()

            return self.post(path, response_model=Response[response_model], **kwargs)(
                wrapper
            )
        return decorator

    def api_post_old(self, path: str, response_model: Type[T], **kwargs):
        def decorator(func: Callable[..., Any]):
            return self.post(path, response_model=Response[response_model], **kwargs)(
                api_response(response_model)(func)
            )
        return decorator

    def api_put(self, path: str, response_model: Type[T], **kwargs):
        def decorator(func: Callable[..., Any]):
            return self.put(path, response_model=Response[response_model], **kwargs)(
                api_response(response_model)(func)
            )
        return decorator

    def api_delete(self, path: str, response_model: Type[T] = None, **kwargs):
        def decorator(func: Callable[..., Any]):
            return self.delete(path, response_model=Response[response_model] if response_model else Response[dict], **kwargs)(
                api_response(response_model or BaseModel)(func)
            )
        return decorator
