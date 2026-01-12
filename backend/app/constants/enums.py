import enum


class LLMType(enum.StrEnum):
    CHAT = "chat"
    EMBEDDING = "embedding"
    SPEECH2TEXT = "speech2text"
    IMAGE2TEXT = "image2text"
    RERANK = "rerank"
    TTS = "tts"
