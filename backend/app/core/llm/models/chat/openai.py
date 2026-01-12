from app.core.llm.models.chat.base import Base
from app.core.llm.models.registry import register


@register("chat", "OpenAI")
class OpenAI(Base):
    def __init__(self, key, model_name="gpt-3.5-turbo", base_url="https://api.openai.com/v1", **kwargs):
        if not base_url:
            base_url = "https://api.openai.com/v1"
        super().__init__(key, model_name, base_url, **kwargs)
