from typing import Annotated

from fastapi import Depends, Request, Response
from fastapi.security import OAuth2PasswordRequestForm

from app.api.controllers.auth_controller import AuthController
from app.api.deps import CurrentUserId, SessionDep
from app.api.models.auth import SigninPublic, TokenPublic, Signup
from app.api.router import ApiRouter

router = ApiRouter(prefix="/auth", tags=["Auth"])


@router.api_post("/signup", response_model=SigninPublic)
async def signup(
    item_in: Signup,
    session: SessionDep,
    request: Request,
    response: Response,
):
    """
    signup for new user
    """
    return await AuthController(session, request, response).signup(item_in)


@router.api_post("/signin", response_model=SigninPublic)
async def signin(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    request: Request,
    response: Response,
):
    """
    signin for frontend with standard response
    """
    return await AuthController(session, request, response).signin(form_data.username, form_data.password)


@router.api_post("/signout", response_model=dict)
async def signout(
    session: SessionDep,
    request: Request,
    response: Response,
    user_id: CurrentUserId,
):
    """
    signout
    """
    return await AuthController(session, request, response).signout(user_id)


@router.api_post("/refresh-token", response_model=TokenPublic)
async def refresh_token(
    session: SessionDep,
    request: Request,
    response: Response,
):
    """
    Refresh access token
    """
    return await AuthController(session, request, response).refresh_token()


@router.post("/token", response_model=TokenPublic)
async def get_token(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    request: Request,
    response: Response,
):
    """
    token for swagger and oauth2
    """
    return AuthController(session, request, response).get_token(form_data.username, form_data.password)
