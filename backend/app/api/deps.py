from typing import Annotated, Optional
from uuid import UUID

from fastapi.security import OAuth2PasswordBearer
from jwt import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session
from fastapi import Depends, Header, HTTPException, status

from app.api.models.auth import TokenPayload
from app.api.models.enums import Status
from app.api.models.tenant import Tenant
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
        raise HTTPException(status_code=404, detail="User not found")
    if user.status != Status.ACTIVE:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user



def get_tenant_id(
    token: TokenDep,
    x_tenant_id: Annotated[str | None, Header()] = None
) -> UUID:
    if x_tenant_id:
        return UUID(x_tenant_id)

    payload = JWTService().decode(token)
    token_data = TokenPayload(**payload)
    return UUID(token_data.sub)


def get_current_tenant(
    session: SessionDep,
    tenant_id: UUID = Depends(get_tenant_id)
) -> Tenant:
    tenant: Optional[Tenant] = session.get(Tenant, tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    if tenant.status != Status.ACTIVE:
        raise HTTPException(status_code=400, detail="Inactive tenant")
    return tenant


CurrentUserId = Annotated[User, Depends(get_user_id)]
CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentTenantId = Annotated[User, Depends(get_tenant_id)]
CurrentTenant = Annotated[Tenant, Depends(get_current_tenant)]
