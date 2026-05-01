from typing import List, Literal

from pydantic import BaseModel
from sqlmodel import Field

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


class ReferenceAudio(BaseModel):
    audio: bytes
    text: str


class TTSRequest(BaseModel):
    text: str
    chunk_length: int = Field(200, ge=100, le=300)
    format: Literal["wav", "pcm", "mp3"] = "mp3"
    mp3_bitrate: Literal[64, 128, 192] = Field(128, alias="mp3_bitrate")
    references: List[ReferenceAudio] = []
    reference_id: str | None = Field(None, alias="reference_id")
    normalize: bool = True
    latency: Literal["normal", "balanced"] = "normal"
