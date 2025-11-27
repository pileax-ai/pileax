from app.api.models.app import App
from app.api.repos.app_repository import AppRepository
from app.api.services.base_service import BaseService

class AppService(BaseService[App]):
    def __init__(self, session, tenant_id, user_id):
        super().__init__(App, session, AppRepository)
        self.tenant_id = tenant_id
        self.user_id = user_id

    def create_default_app(self, mode: str) -> App:
        app = super().get(self.tenant_id, False)

        if app:
            return app

        # Set default app's Id with tenant_id
        return super().save(App(
            id=self.tenant_id,
            tenant_id=self.tenant_id,
            user_id=self.user_id,
            name="default",
            mode=mode
        ))

