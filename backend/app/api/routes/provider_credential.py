import uuid
from typing import Any

from fastapi import Depends

from app.api.controllers.provider_credential_controller import ProviderCredentialController
from app.api.router import ApiRouter

from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.provider_credential import ProviderCredentialCreate, ProviderCredentialUpdate, ProviderCredentialPublic

router = ApiRouter(prefix="/provider/credential", tags=["ProviderCredential"])


@router.api_post("", response_model=ProviderCredentialPublic)
def save(item_in: ProviderCredentialCreate, controller: ProviderCredentialController = Depends()) -> Any:
    return controller.save(item_in)


@router.api_get("", response_model=ProviderCredentialPublic)
def get(id: uuid.UUID, controller: ProviderCredentialController = Depends()) -> Any:
    return controller.get(id)


@router.api_put("", response_model=ProviderCredentialPublic)
def update(item_in: ProviderCredentialUpdate, controller: ProviderCredentialController = Depends()) -> Any:
    return controller.update(item_in)


@router.api_delete("")
def delete(id: uuid.UUID, controller: ProviderCredentialController = Depends()) -> Any:
    return controller.delete(id)


@router.api_post("/query", response_model=QueryResult[ProviderCredentialPublic])
def query(query: PaginationQuery, controller: ProviderCredentialController = Depends()) -> Any:
    return controller.query(query)
