from app.api.models.file_meta import FileMeta
from app.api.repos.file_meta_repository import FileMetaRepository
from app.api.services.base_service import BaseService


class FileMetaService(BaseService[FileMeta]):
    def __init__(self, session):
        super().__init__(FileMeta, session, FileMetaRepository)

    def get_by_sha1(self, sha1: str) -> FileMeta:
        return self.find_one({"sha1": sha1})
