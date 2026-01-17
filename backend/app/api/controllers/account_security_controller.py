from app.api.deps import CurrentUser, SessionDep
from app.api.models.account_security import ChangePassword
from app.api.services.account_security_service import AccountSecurityService


class AccountSecurityController:
    def __init__(
        self,
        session: SessionDep,
        user: CurrentUser,
    ):
        self.session = session
        self.service = AccountSecurityService(session, user)

    def change_password(self, item_in: ChangePassword):
        return self.service.change_password(item_in)
