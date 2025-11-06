from app.api.models.app import App
from app.api.repos.app_repository import AppRepository
from app.api.services.base_service import BaseService

class AppService(BaseService[App]):
    def __init__(self, session):
        super().__init__(App, session, AppRepository)
