import logging

import requests

from app.core.llm.models.tts.base import Base

logger = logging.getLogger(__name__)


class HTTPBasedTTS(Base):
    """
    Base class for HTTP-based TTS services.
    Provides common HTTP request handling and response processing.
    """

    def __init__(self, key, model_name, base_url, **kwargs):
        self.model_name = model_name
        self.base_url = base_url
        self.api_key = key
        self.headers = {"Content-Type": "application/json"}
        if key and key != "x":
            self.headers["Authorization"] = f"Bearer {self.api_key}"

    def _build_payload(self, text, voice, **kwargs):
        """
        Build payload for TTS request.
        Subclasses should override this method if they need custom payload structure.
        """
        return {"model": self.model_name, "voice": voice, "input": text}

    def _send_request(self, endpoint, payload, stream=True):
        """
        Send HTTP request to TTS service.
        """
        url = f"{self.base_url}{endpoint}"
        response = requests.post(url, headers=self.headers, json=payload, stream=stream)

        if response.status_code != 200:
            raise Exception(f"**Error**: {response.status_code}, {response.text}")

        return response

    def _process_response(self, response):
        """
        Process streaming response from TTS service.
        """
        for chunk in response.iter_content():
            if chunk:
                yield chunk

    def tts(self, text, voice="alloy"):
        """
        Generate speech from text.
        """
        text = self.normalize_text(text)
        payload = self._build_payload(text, voice)
        response = self._send_request("/audio/speech", payload)
        return self._process_response(response)
