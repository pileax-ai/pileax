from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import SessionDep
from app.api.models.auth import Token
from app.api.models.response import Response, send_ok
from app.api.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signin", response_model=Response[Token])
def signin(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """
    signin
    """
    service = AuthService(session)
    res = service.signin(form_data.username, form_data.password)
    return send_ok(res)
