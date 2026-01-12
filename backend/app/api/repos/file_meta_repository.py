from app.api.models.file_meta import FileMeta
from app.api.repos.base_repository import BaseRepository


class FileMetaRepository(BaseRepository[FileMeta]):
    def __init__(self, model, session):
        super().__init__(model, session)
