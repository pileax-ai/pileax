import json
import uuid
from typing import List, Any
from fastapi import UploadFile

from app.api.controllers.base_controller import BaseController
from app.api.controllers.file_meta_controller import FileMetaController
from app.api.controllers.tenant_book_controller import TenantBookController
from app.api.deps import SessionDep, CurrentUserId, CurrentTenantId
from app.api.models.book import Book, BookCreate, BookUpdate
from app.api.models.file_meta import FileMetaCreate
from app.api.models.tenant_book import TenantBookCreate
from app.api.services.book_service import BookService
from app.libs.book_uploader import BookUploader


class BookController(BaseController[Book, BookCreate, BookUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        tenant_id: CurrentTenantId
    ):
        super().__init__(Book, session, tenant_id, user_id)
        self.service = BookService(session)
        self.fm_controller = FileMetaController(session, tenant_id, user_id)
        self.tb_controller = TenantBookController(session, tenant_id, user_id)

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
            self.fm_controller.save(FileMetaCreate(**meta))
        book_in.id = id
        book_in.path = sha1
        book_out = self.save(book_in)
        book_out_data = book_out.dict()

        # save tenant_book
        tenant_book_in = TenantBookCreate(book_id=id)
        self.tb_controller.save(tenant_book_in)

        return book_out_data
