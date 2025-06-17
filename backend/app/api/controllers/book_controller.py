import json
import uuid
from typing import Optional, List, Any
from fastapi import UploadFile

from app.api.controllers.base_controller import BaseController
from app.api.controllers.file_meta_controller import FileMetaController
from app.api.controllers.user_book_controller import UserBookController
from app.api.models.book import Book, BookCreate, BookUpdate
from app.api.models.file_meta import FileMetaCreate
from app.api.models.user_book import UserBookCreate
from app.api.services.book_service import BookService
from app.utils.book_uploader import BookUploader


class BookController(BaseController[Book, BookCreate, BookUpdate]):
    def __init__(self, session, user_id: Optional[str] = None):
        super().__init__(Book, session, user_id)
        self.service = BookService(session)
        self.file_meta_controller = FileMetaController(session, user_id)
        self.user_book_controller = UserBookController(session, user_id)

    def get_by_uuid(self, uuid: str) -> Book:
        return self.service.get_by_uuid(uuid)


    async def upload(self, book: str, files: List[UploadFile]) -> Any:
        """
        Upload a book
        :param book: Book metadata
        :param files: Book file and cover
        """
        book_in = BookCreate(**json.loads(str(book)))
        id = uuid.uuid4()
        sha1 = book_in.uuid

        # upload
        metas = await BookUploader(str(id), sha1).upload(files)

        # save book
        for meta in metas:
            file_name = str(meta["file_name"])
            if file_name.startswith("book"):
                book_in.file_name = file_name
            else:
                book_in.cover_name = file_name
            # save file_meta
            self.file_meta_controller.save(FileMetaCreate(**meta))
        book_in.id = id
        book_in.path = sha1
        book_out = self.save(book_in)
        book_out_data = book_out.dict()

        # save user_book
        user_book_in = UserBookCreate(book_id=id)
        self.user_book_controller.save(user_book_in)

        return book_out_data
