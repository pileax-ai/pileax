import json
from json import JSONDecodeError

from app.core.llm.models.chat.base import Base
from app.core.llm.models.registry import register


@register("chat", "VolcEngine")
class VolcEngine(Base):
    def __init__(self, key, model_name, base_url="https://ark.cn-beijing.volces.com/api/v3", **kwargs):
        if not base_url:
            base_url = "https://ark.cn-beijing.volces.com/api/v3"

        try:
            ark_api_key = json.loads(key).get("ark_api_key", "")
            model_name = json.loads(key).get("ep_id", "") + json.loads(key).get("endpoint_id", "")
            super().__init__(ark_api_key, model_name, base_url, **kwargs)
        except JSONDecodeError:
            super().__init__(key, model_name, base_url, **kwargs)
