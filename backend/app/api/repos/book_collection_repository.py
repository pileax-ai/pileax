from app.api.models.book_collection import BookCollection
from app.api.repos.base_repository import BaseRepository


class BookCollectionRepository(BaseRepository[BookCollection]):
    def __init__(self, model, session):
        super().__init__(model, session)
