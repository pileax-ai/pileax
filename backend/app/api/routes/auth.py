from os import access
from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import SessionDep
from app.api.models.auth import Token, SigninPublic, SigninVo
from app.api.router import send_ok, Response
from app.api.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signin", response_model=Response[SigninVo])
def signin(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """
    signin for frontend with standard response
    """
    res = AuthService(session).signin(form_data.username, form_data.password)
    token = f"Bearer {res.token.access_token}"
    account = SigninVo(account=res.user, token=token)
    return send_ok(account)


@router.post("/token", response_model=Token)
def token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """
    token for swagger and oauth2
    """
    res = AuthService(session).signin(form_data.username, form_data.password)
    return res.token
