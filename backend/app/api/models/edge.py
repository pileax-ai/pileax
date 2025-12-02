import uuid

from sqlmodel import Field, Integer, text

from app.api.models.base import BaseApiModel, BaseSQLModel, BaseMixin, uuid_field


class EdgeTTS(BaseApiModel):
    text: str
    voice: str | None = None
    rate: str | None = "+0%"
    pitch: str | None = "+0Hz"
    volume: str | None = "+0%"


class EdgeTTSPublic(EdgeTTS, BaseMixin):
    pass
