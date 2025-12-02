from typing import Any, List

from fastapi import Depends

from app.api.controllers.edge_controller import EdgeController
from app.api.models.edge import EdgeTTSPublic, EdgeTTS
from app.api.router import ApiRouter


router = ApiRouter(prefix="/edge", tags=["App"])


@router.api_get("/voices", response_model=List[dict])
def get_voices(controller: EdgeController = Depends()) -> Any:
    return controller.get_voices()


@router.api_post("/tts", response_model=EdgeTTSPublic)
def tts(item_in: EdgeTTS, controller: EdgeController = Depends()) -> Any:
    return controller.tts(item_in)
