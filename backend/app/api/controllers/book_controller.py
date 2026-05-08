import json
import logging
import uuid
from typing import Any

from fastapi import HTTPException, UploadFile
from sqlalchemy.exc import IntegrityError

from app.api.controllers.base_controller import BaseController
from app.api.controllers.file_meta_controller import FileMetaController
from app.api.controllers.workspace_book_controller import WorkspaceBookController
from app.api.deps import CurrentUser, CurrentWorkspace, SessionDep
from app.api.models.book import Book, BookBase, BookCreate, BookMedia, BookMediaType, BookPublic, BookUpdate
from app.api.models.file_meta import FileMetaCreate
from app.api.models.owner import Owner
from app.api.models.query import PaginationQuery, QueryResult
from app.api.models.workspace_book import WorkspaceBookCreate, WorkspaceBookDetails
from app.api.services.book_service import BookService
from app.api.services.workspace_book_service import WorkspaceBookService
from app.libs.book.book_helper import BookHelper
from app.libs.book.book_uploader import BookUploader

logger = logging.getLogger(__name__)


class BookController(BaseController[Book, BookCreate, BookUpdate]):
    def __init__(
        self,
        session: SessionDep,
        user: CurrentUser,
        workspace: CurrentWorkspace,
    ):
        super().__init__(Book, session, user, workspace)
        self.session = session
        self.workspace = workspace
        self.service = BookService(session)
        self.wb_service = WorkspaceBookService(session)
        self.fm_controller = FileMetaController(session, user, workspace)
        self.wb_controller = WorkspaceBookController(session, user, workspace)

    async def save(self, book_in: BookCreate) -> WorkspaceBookDetails:
        # Check if ISBN exists
        if book_in.isbn and book_in.id is None:
            book = self.service.get_by_isbn(book_in.isbn, self.workspace.tenant_id)
            if book:
                raise HTTPException(status_code=409, detail=f"Book with {book_in.isbn} exists")

        # Generate book it
        book_id = book_in.id
        if book_in is None:
            book_id = uuid.uuid4()
            book_in.id = book_id

        # Save image locally
        cover_url = book_in.cover_url
        meta = await BookHelper.download_image(cover_url)
        if meta:
            book_in.cover_url = meta["url"]
            meta["ref_id"] = str(book_id)
            meta["ref_type"] = "book"
            self.fm_controller.save(FileMetaCreate(**meta))

        # Save book
        book = super().save(book_in)

        # Save workspace_book
        workspace_book_in = WorkspaceBookCreate(book_id=book_id)
        workspace_book = self.wb_controller.save(workspace_book_in)

        return WorkspaceBookService(self.session).get_details(workspace_book.id)

    def get(self, id: uuid.UUID) -> Book:
        return self.service.get_by_owner(Owner(user_id=self.user.id), id)

    def get_by_uuid(self, uuid: str) -> Book:
        return self.service.get_by_uuid(uuid, self.workspace.tenant_id)

    async def get_by_isbn(self, isbn: str) -> BookBase:
        # Check if ISBN exists
        book = self.service.get_by_isbn(isbn, self.workspace.tenant_id)
        if book:
            raise HTTPException(status_code=409, detail=f"Book with {isbn} exists")

        # Fetch book info
        book_list = await BookHelper.fetch_book_by_isbn(isbn)
        if len(book_list) == 0:
            raise HTTPException(status_code=404, detail=f"Book with {isbn} not found")
        else:
            return BookBase(**book_list[0])

    def get_details(self, id: uuid.UUID) -> WorkspaceBookDetails:
        book = self.wb_service.get_workspace_book_details(id, self.user.id, self.workspace.id)
        book_details = WorkspaceBookDetails(**book)
        self.service.check_read_permission(Owner(workspace=self.workspace, user_id=self.user.id), book_details)
        return book_details

    async def upload(self, book_str: str, files: list[UploadFile]) -> Any:
        """
        Upload a book
        :param book_str: Book metadata
        :param files: Book file and cover
        """
        book_in = BookCreate(**json.loads(str(book_str)))
        if book_in.id:
            book_id = book_in.id
        else:
            book_id = uuid.uuid4()
            book_in.id = book_id
        book_in.path = BookHelper.build_book_path(book_in.uuid)

        book_media = BookMedia(
            type=BookMediaType.DIGITAL,
            sha1=book_in.uuid,
            format=book_in.extension,
        )

        same_book = self.find_one({"uuid": book_in.uuid})

        # Only upload when book is a new one
        if same_book:
            book_in.file_url = same_book.file_url
            book_in.cover_url = same_book.cover_url
        else:
            metas = await BookUploader(book_in).upload(files)

            # save book meta
            for meta in metas:
                file_name = str(meta["file_name"])
                url = str(meta["url"])
                if file_name.startswith("book"):
                    book_in.file_url = url
                    book_media.file_url = url
                    book_media.size = meta["size"]
                else:
                    book_in.cover_url = url
                    book_media.cover_url = url
                # save file_meta
                try:
                    self.fm_controller.save(FileMetaCreate(**meta))
                except IntegrityError as e:
                    self.session.rollback()
                    logger.info("File metadata already exists for SHA1: %s", meta.get("sha1"))
                    continue

        # if book already exists, update media
        existing_book = self.service.get_by_owner(Owner(user_id=self.user.id), book_id, raise_exception=False)
        if existing_book:
            book_in.media = [*existing_book.media, book_media]
        else:
            book_in.tenant_id = self.workspace.tenant_id
            book_in.tenant_id = self.workspace.tenant_id
            book_in.media = [book_media]

        book = super().save(book_in)

        # save workspace_book
        workspace_book_in = WorkspaceBookCreate(book_id=book_id)
        workspace_book = self.wb_controller.save(workspace_book_in)

        return WorkspaceBookService(self.session).get_details(workspace_book.id)

    def query_library(self, query: PaginationQuery) -> QueryResult[BookPublic]:
        return self.service.query_library(self.user.id, self.workspace_id, query)
