import logging
import time

from app.core.llm.models.registry import register
from app.core.llm.models.tts.base import Base
from app.core.llm.utils.token import num_tokens_from_string

logger = logging.getLogger(__name__)


@register("tts", "Tongyi")
class TongyiTTS(Base):
    """
    @see https://help.aliyun.com/zh/model-studio/sambert-python-sdk?spm=a2c4g.11186623.0.i8#undefined
    """

    def __init__(self, key, model_name, base_url="", **kwargs):
        import dashscope

        self.model_name = model_name
        dashscope.api_key = key

    def _clean_options(self, **kwargs):
        raw_rate = kwargs.get("rate", 1.0)
        try:
            rate = float(raw_rate)
        except (ValueError, TypeError):
            rate = 1.0

        # DashScope: rate [0.5, 2.0]
        rate = max(0.5, min(2.0, rate))

        raw_pitch = kwargs.get("pitch", 1.0)
        try:
            pitch = float(raw_rate)
        except (ValueError, TypeError):
            pitch = 1.0

        # DashScope: rate [0.5, 2.0]
        pitch = max(0.5, min(2.0, rate))

        options = {
            # "pitch": pitch,
            "rate": rate,
            "format": "mp3",
        }
        return options

    def tts(self, text, **kwargs):
        from collections import deque

        from dashscope.api_entities.dashscope_response import SpeechSynthesisResponse
        from dashscope.audio.tts import ResultCallback, SpeechSynthesisResult, SpeechSynthesizer

        class Callback(ResultCallback):
            def __init__(self) -> None:
                self.dque = deque()

            def _run(self):
                while True:
                    if not self.dque:
                        time.sleep(0)
                        continue
                    val = self.dque.popleft()
                    if val:
                        yield val
                    else:
                        break

            def on_open(self):
                pass

            def on_complete(self):
                self.dque.append(None)

            def on_error(self, response: SpeechSynthesisResponse):
                raise RuntimeError(str(response))

            def on_close(self):
                pass

            def on_event(self, result: SpeechSynthesisResult):
                if result.get_audio_frame() is not None:
                    self.dque.append(result.get_audio_frame())

        text = self.normalize_text(text)
        callback = Callback()

        # options
        options = self._clean_options(**kwargs)

        SpeechSynthesizer.call(model=self.model_name, text=text, callback=callback, **options)
        try:
            yield from callback._run()
            yield num_tokens_from_string(text)

        except Exception as e:
            raise RuntimeError(f"**ERROR**: {e}")
