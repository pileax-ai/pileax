import logging

from app.core.llm.models.registry import register
from app.core.llm.models.tts.base import Base
from app.core.llm.utils.token import num_tokens_from_string

logger = logging.getLogger(__name__)


@register("tts", "Tongyi")
class TongyiTTS(Base):
    def __init__(self, key, model_name, base_url=""):
        import dashscope

        self.model_name = model_name
        dashscope.api_key = key

    def tts(self, text):
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
        SpeechSynthesizer.call(model=self.model_name, text=text, callback=callback, format="mp3")
        try:
            for data in callback._run():
                yield data
            yield num_tokens_from_string(text)

        except Exception as e:
            raise RuntimeError(f"**ERROR**: {e}")
