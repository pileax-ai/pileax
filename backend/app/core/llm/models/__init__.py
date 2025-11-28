from .loader import load_models
from .registry import MODEL_FACTORY

from app.core.llm.models.chat import *
# import app.core.llm.models.chat as chat_package
import app.core.llm.models.cv as cv_package
import app.core.llm.models.embedding as embedding_package
import app.core.llm.models.rerank as rerank_package
import app.core.llm.models.stt as sst_package
import app.core.llm.models.tts as tts_package

# load_models(chat_package)
load_models(cv_package)
load_models(embedding_package)
load_models(rerank_package)
load_models(sst_package)
load_models(tts_package)

ChatModel = MODEL_FACTORY["chat"]
CvModel = MODEL_FACTORY["cv"]
EmbeddingModel = MODEL_FACTORY["embedding"]
RerankModel = MODEL_FACTORY["rerank"]
Seq2txtModel = MODEL_FACTORY["stt"]
TTSModel = MODEL_FACTORY["tts"]

__all__ = [
    "ChatModel", "CvModel", "EmbeddingModel",
    "RerankModel", "Seq2txtModel", "TTSModel"
]
