import logging
import re
from abc import ABC

logger = logging.getLogger(__name__)


class Base(ABC):
    def __init__(self, key, model_name, base_url, **kwargs):
        """
        Abstract base class constructor.
        Parameters are not stored; subclasses should handle their own initialization.
        """
        pass

    def tts(self, audio):
        pass

    def normalize_text(self, text):
        return re.sub(r"(\*\*|##\d+\$\$|#)", "", text)
