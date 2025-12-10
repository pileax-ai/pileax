from typing import Annotated, Optional
from uuid import UUID

from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from fastapi import Depends, Header, HTTPException, status

from app.api.models.auth import TokenPayload
from app.api.models.enums import Status
from app.api.models.workspace import Workspace
from app.api.models.user import User
from app.configs import app_config

from app.extensions.ext_database import get_db_session
from app.libs.jwt_service import JWTService

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{app_config.API_VERSION}/auth/token"
)


SessionDep = Annotated[Session, Depends(get_db_session)]
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_user_id(token: TokenDep) -> UUID:
    payload = JWTService().decode(token)
    token_data = TokenPayload(**payload)
    return UUID(token_data.sub)


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    payload = JWTService().decode(token)
    token_data = TokenPayload(**payload)
    user: Optional[User] = session.get(User, token_data.sub)
    if not user:
        raise HTTPException(status_code=403, detail="User not found")
    if user.status != Status.ACTIVE:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user



def get_workspace_id(
    token: TokenDep,
    x_workspace_id: Annotated[str | None, Header()] = None
) -> UUID:
    if x_workspace_id:
        return UUID(x_workspace_id)

    payload = JWTService().decode(token)
    token_data = TokenPayload(**payload)
    return UUID(token_data.sub)


def get_current_workspace(
    session: SessionDep,
    workspace_id: UUID = Depends(get_workspace_id)
) -> Workspace:
    workspace: Optional[Workspace] = session.get(Workspace, workspace_id)
    if not workspace:
        raise HTTPException(status_code=403, detail="Workspace not found")
    if workspace.status != Status.ACTIVE:
        raise HTTPException(status_code=400, detail="Inactive workspace")
    return workspace


CurrentUserId = Annotated[UUID, Depends(get_user_id)]
CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentWorkspaceId = Annotated[UUID, Depends(get_workspace_id)]
CurrentWorkspace = Annotated[Workspace, Depends(get_current_workspace)]
CurrentWorkspaceOptional = Annotated[Optional[Workspace], Depends(get_current_workspace)]
