import os

from .base import Base
from ..registry import register

FACTORY_NAMES = [
    "Tongyi-Qianwen",
    "Bedrock",
    "Moonshot",
    "xAI",
    "DeepInfra",
    "Groq",
    "Cohere",
    "Gemini",
    "DeepSeek",
    "NVIDIA",
    "TogetherAI",
    "Anthropic",
    "Ollama",
    "Meituan",
    "CometAPI",
    "SILICONFLOW",
    "OpenRouter",
    "StepFun",
    "PPIO",
    "PerfXCloud",
    "Upstage",
    "NovitaAI",
    "01.AI",
    "GiteeAI",
    "302.AI",
]

@register("chat", FACTORY_NAMES)
class LiteLLMBase(Base):
    def __init__(self, key, model_name, base_url=None, **kwargs):
        self.timeout = int(os.environ.get("LM_TIMEOUT_SECONDS", 600))
        self.provider = kwargs.get("provider", "")
        self.model_name = f"{self.prefix}{model_name}"
        self.api_key = key
        # Configure retry parameters
        self.max_retries = kwargs.get("max_retries", int(os.environ.get("LLM_MAX_RETRIES", 5)))
        self.base_delay = kwargs.get("retry_interval", float(os.environ.get("LLM_BASE_DELAY", 2.0)))
        self.max_rounds = kwargs.get("max_rounds", 5)
        self.is_tools = False
        self.tools = []
        self.toolcall_sessions = {}
