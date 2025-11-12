from app.api.models.book_collection import BookCollection
from app.api.repos.book_collection_repository import BookCollectionRepository
from app.api.services.base_service import BaseService

class BookCollectionService(BaseService[BookCollection]):
    def __init__(self, session):
        super().__init__(BookCollection, session, BookCollectionRepository)
