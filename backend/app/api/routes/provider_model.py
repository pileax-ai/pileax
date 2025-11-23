from typing import Any, List

from fastapi import Depends

from app.api.controllers.provider_model_controller import ProviderModelController
from app.api.router import ApiRouter

router = ApiRouter(prefix="/provider/model", tags=["ProviderModel"])


@router.api_get("/all", response_model=List[dict])
def find_all(controller: ProviderModelController = Depends()) -> Any:
    return controller.find_all()


@router.api_get("/by-type", response_model=List[dict])
def find_by_type(model_type: str, controller: ProviderModelController = Depends()) -> Any:
    return controller.find_by_type(model_type)
