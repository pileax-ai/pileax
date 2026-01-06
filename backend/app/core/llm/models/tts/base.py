import logging
import re
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class Base(ABC):
    @abstractmethod
    def __init__(self, key, model_name, base_url, **kwargs):
        """
        Abstract base class constructor.
        Parameters are not stored; subclasses should handle their own initialization.
        """
        ...

    @abstractmethod
    def tts(self, audio):
        ...

    def normalize_text(self, text):
        return re.sub(r"(\*\*|##\d+\$\$|#)", "", text)
