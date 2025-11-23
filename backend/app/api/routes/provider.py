import uuid
from typing import Any, List

from fastapi import Depends

from app.api.controllers.provider_controller import ProviderController
from app.api.router import ApiRouter

from app.api.models.provider import ProviderPublic, ProviderUpdate, ProviderAllPublic

router = ApiRouter(prefix="/provider", tags=["Provider"])


@router.api_get("/all", response_model=List[ProviderAllPublic])
def find_all(controller: ProviderController = Depends()) -> Any:
    return controller.find_all()


@router.api_put("", response_model=ProviderPublic)
def update(item_in: ProviderUpdate, controller: ProviderController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: ProviderController = Depends()) -> Any:
    return controller.delete(id)
