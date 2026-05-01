import logging

import httpx
import ormsgpack

from app.api.models.llm_message import TTSRequest
from app.core.llm.models.registry import register
from app.core.llm.models.tts.base import Base
from app.core.llm.utils.token import num_tokens_from_string

logger = logging.getLogger(__name__)


@register("tts", "FishAudio")
class FishAudio(Base):
    def __init__(self, key, model_name, base_url="https://api.fish.audio/v1/tts", **kwargs):
        if not base_url:
            base_url = "https://api.fish.audio/v1/tts"
        self.headers = {
            "api-key": key,
            "content-type": "application/msgpack",
        }
        self.base_url = base_url

    def tts(self, text, **kwargs):
        from http import HTTPStatus

        text = self.normalize_text(text)
        request = TTSRequest(text=text, reference_id="7f92f8afb8ec43bf81429cc1c9199cb1")
        request_data = request.model_dump(by_alias=True, exclude_none=True)

        timeout = httpx.Timeout(
            timeout=60.0,
            connect=10.0,
            read=30.0
        )
        with httpx.Client(timeout=timeout) as client:
            try:
                with client.stream(
                    method="POST",
                    url=self.base_url,
                    content=ormsgpack.packb(request_data),
                    headers=self.headers,
                    timeout=30.0,
                ) as response:
                    if response.status_code == HTTPStatus.OK:
                        yield from response.iter_bytes()
                    else:
                        response.raise_for_status()

                yield num_tokens_from_string(text)

            except httpx.HTTPStatusError as e:
                raise RuntimeError(f"**ERROR**: {e}")
