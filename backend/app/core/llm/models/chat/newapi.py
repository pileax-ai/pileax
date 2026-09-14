from app.core.llm.models.chat.base import Base
from app.core.llm.models.registry import register


@register("chat", "NewAPI")
class NewAPI(Base):
    def __init__(self, key, model_name, base_url, **kwargs):
        if not base_url:
            raise ValueError("base_url cannot be None")
        model_name = model_name.split("___")[0]
        super().__init__(key, model_name, base_url, **kwargs)
