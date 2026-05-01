from typing import Any

from fastapi import Depends

from app.api.controllers.tts_controller import TTSController
from app.api.models.llm_message import LLMMessage, LLMTTSMessage
from app.api.router import ApiRouter

router = ApiRouter(prefix="/tts", tags=["LLM TTS"])


@router.api_post("/llm", response_model=LLMMessage)
async def tts_llm(item_in: LLMTTSMessage, controller: TTSController = Depends()) -> Any:
    return controller.tts_llm(item_in)
