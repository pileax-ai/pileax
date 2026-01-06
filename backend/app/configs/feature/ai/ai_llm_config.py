
from pydantic import Field
from pydantic_settings import BaseSettings


class AiLlmConfig(BaseSettings):
    """
    Configuration for AI LLM
    """

    FACTORY_LLM_INFOS: list[dict] = Field(
        description="LLM factory information",
        default=[],
    )
