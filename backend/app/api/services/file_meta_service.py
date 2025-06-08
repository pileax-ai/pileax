from app.api.models.file_meta import FileMeta
from app.api.repos.file_meta_repository import FileMetaRepository
from app.api.services.base_service import BaseService

class FileMetaService(BaseService[FileMeta]):
    def __init__(self, session):
        super().__init__(FileMeta, session, FileMetaRepository)
