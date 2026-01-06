import base64
import secrets

from fastapi import HTTPException, status

from app.api.models.auth import LoginUpdate, Signin, Token
from app.api.models.enums import Status
from app.api.models.user import User
from app.api.services.tenant_service import TenantService
from app.api.services.user_service import UserService
from app.api.services.workspace_service import WorkspaceService
from app.configs import app_config
from app.libs.helper import get_current_time
from app.libs.jwt_service import JWTService
from app.libs.password import compare_password, hash_password


class AuthService:
    def __init__(self, session):
        self.service = UserService(session)
        self.session = session

    def signup(self, obj: User) -> User:
        if obj.password:
            # generate password salt
            salt = secrets.token_bytes(16)
            password_salt = base64.b64encode(salt).decode()

            # encrypt password with salt
            password_hashed = hash_password(obj.password, salt)
            obj.password = base64.b64encode(password_hashed).decode()
            obj.password_salt = password_salt

        # Create user
        obj.status = Status.ACTIVE
        user = self.service.create(obj)

        # Create default tenant
        tenant = TenantService(self.session).create_default(user)

        # Create default workspace
        WorkspaceService(self.session).create_default(user, tenant)

        return user

    def signin(self, data: Signin) -> User:
        app_edition = app_config.DEPLOY_EDITION
        # query = select(User).where(User.email == email)
        # user = self.session.exec(query).first()
        user = self.session.query(User).filter_by(email=data.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="auth.signin.incorrect")

        if user.password is None or not compare_password(data.password, user.password, user.password_salt):
            raise HTTPException(status_code=403, detail="auth.signin.incorrect")

        return user

    def login(self, user: User, ip: str | None = None) -> Token:
        item_in = LoginUpdate(last_login_ip=ip, last_login_time=get_current_time())
        self.service.update(user.id, item_in.model_dump(exclude_unset=True, exclude_none=True))

        # todo: cache/save refresh_token

        return Token(
            access_token=JWTService().issue_access_token(str(user.id)),
            refresh_token=JWTService().issue_refresh_token(str(user.id)),
            csrf_token=JWTService().issue_csrf_token(str(user.id)),
        )

    def refresh_token(self, token: str) -> Token:
        try:
            payload = JWTService().decode(token)
            user_id = payload["sub"]

            # todo: reset refresh_token

            return Token(
                access_token=JWTService().issue_access_token(user_id),
                refresh_token=JWTService().issue_refresh_token(user_id),
                csrf_token=JWTService().issue_csrf_token(user_id),
            )
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid refresh token.",
            )

