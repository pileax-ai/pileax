from pydantic import Field
from pydantic_settings import BaseSettings

from app.api.models.provider import LLMConfigInfo


class AiLlmConfig(BaseSettings):
    """
    Configuration for AI LLM
    """

    LLM_CONFIG: LLMConfigInfo | None = Field(
        description="LLM providers and models configuration",
        default=None,
    )

    LLM_CONFIG_URL: str = Field(
        description="LLM providers and models configuration online url",
        default="https://www.pileax.ai/update/llm_config.json",
    )
