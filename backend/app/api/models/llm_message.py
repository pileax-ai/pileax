import uuid
from app.api.models.base import BaseApiModel

class LLMMessage(BaseApiModel):
    message: str
    stream: bool | None = None
    model_provider: str | None = None
    model_name: str | None = None
    model_type: str | None = None

class TTSOptions(BaseApiModel):
    voice: str | None = None
    rate: str | None = None
    pitch: str | None = None
    volume: str | None = None


class LLMTTSMessage(LLMMessage, TTSOptions):
    pass
