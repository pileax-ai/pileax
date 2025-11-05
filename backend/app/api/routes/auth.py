from typing import Annotated
from fastapi import Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.api.controllers.auth_controller import AuthController
from app.api.deps import SessionDep
from app.api.models.auth import Token, SigninVo, Signin
from app.api.models.user import UserCreate
from app.api.router import ApiRouter
from app.api.services.auth_service import AuthService

router = ApiRouter(prefix="/auth", tags=["Auth"])

@router.api_post("/signup", response_model=SigninVo)
def signup(
    item_in: UserCreate,
    session: SessionDep,
    request: Request,
    response: Response,
):
    """
    signup for new user
    """
    res = AuthController(session, request, response).signup(item_in)
    token = f"Bearer {res.token.access_token}"
    return SigninVo(account=res.user, token=token)


@router.api_post("/signin", response_model=SigninVo)
def signin(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    request: Request,
    response: Response,
):
    """
    signin for frontend with standard response
    """
    res = (AuthController(session, request, response)
           .signin(form_data.username, form_data.password))
    token = f"Bearer {res.token.access_token}"
    return SigninVo(account=res.user, token=token)


@router.post("/token", response_model=Token)
def get_token(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """
    token for swagger and oauth2
    """
    data = Signin(email=form_data.username, password=form_data.password)
    res = AuthService(session).signin(data)
    return res.token
