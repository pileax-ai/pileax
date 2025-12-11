import json
import uuid
from typing import List, Any
from fastapi import UploadFile

from app.api.controllers.base_controller import BaseController
from app.api.controllers.file_meta_controller import FileMetaController
from app.api.controllers.workspace_book_controller import WorkspaceBookController
from app.api.deps import SessionDep, CurrentUserId, CurrentWorkspace
from app.api.models.book import Book, BookCreate, BookUpdate, BookDetails, BookPublic
from app.api.models.file_meta import FileMetaCreate
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_book import WorkspaceBookCreate
from app.api.repos.workspace_book_repository import WorkspaceBookRepository
from app.api.services.book_service import BookService
from app.libs.book_uploader import BookUploader


class BookController(BaseController[Book, BookCreate, BookUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user_id: CurrentUserId,
        workspace: CurrentWorkspace,
    ):
        super().__init__(Book, session, user_id, workspace.id)
        self.workspace = workspace
        self.service = BookService(session)
        self.fm_controller = FileMetaController(session, user_id, workspace.id)
        self.wb_controller = WorkspaceBookController(session, user_id, workspace.id)

    def get_by_uuid(self, uuid: str) -> Book:
        return self.service.get_by_uuid(uuid, self.workspace.tenant_id)

    def get_details(self, id: uuid.UUID) -> BookDetails:
        return self.service.get_details(id, self.user_id)

    async def upload(self, book_str: str, files: List[UploadFile]) -> Any:
        """
        Upload a book
        :param book_str: Book metadata
        :param files: Book file and cover
        """
        book_in = BookCreate(**json.loads(str(book_str)))
        book_id = uuid.uuid4()
        sha1 = book_in.uuid

        # upload
        metas = await BookUploader(str(book_id), sha1).upload(files)

        # save book
        for meta in metas:
            file_name = str(meta["file_name"])
            if file_name.startswith("book"):
                book_in.file_name = file_name
            else:
                book_in.cover_name = file_name
            # save file_meta
            self.fm_controller.save(FileMetaCreate(**meta))
        book_in.id = book_id
        book_in.path = sha1
        book_in.tenant_id = self.workspace.tenant_id
        book_in.tenant_id = self.workspace.tenant_id
        book = self.save(book_in)

        # save workspace_book
        workspace_book_in = WorkspaceBookCreate(book_id=book_id)
        workspace_book = self.wb_controller.save(workspace_book_in)

        return WorkspaceBookRepository.build_details(workspace_book, book)

    def query_library(self, query: PaginationQuery) -> QueryResult[BookPublic]:
        return self.service.query_library(self.user_id, self.workspace_id, query)
