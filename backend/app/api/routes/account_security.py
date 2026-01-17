from typing import Any

from fastapi import Depends

from app.api.controllers.account_security_controller import AccountSecurityController
from app.api.models.account_security import ChangePassword
from app.api.router import ApiRouter

router = ApiRouter(prefix="/account/security", tags=["AccountSecurity"])


@router.api_put("/password", response_model=dict)
async def change_password(item_in: ChangePassword, controller: AccountSecurityController = Depends()) -> Any:
    return controller.change_password(item_in)

