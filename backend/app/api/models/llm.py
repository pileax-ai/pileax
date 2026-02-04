from sqlalchemy import Integer, text
from sqlmodel import Field, UniqueConstraint

from app.api.models.base import BaseMixin, BaseSQLModel
from app.api.models.enums import Status


class LLM(BaseSQLModel, BaseMixin, table=True):
    __table_args__ = (UniqueConstraint("provider", "model_name", name="unique_llm_workspace_provider_model_name"),)

    provider: str = Field(...)
    model_name: str = Field(...)
    model_type: str = Field(...)
    tags: str | None = Field(default=None)
    max_tokens: int = Field(...)
    is_tools: int = Field(
        default=Status.ACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.INACTIVE))}
    )
    status: int = Field(
        default=Status.ACTIVE, sa_type=Integer, sa_column_kwargs={"server_default": text(str(Status.ACTIVE))}
    )
