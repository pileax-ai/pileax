from fastapi import APIRouter

from app.api.routes import auth, book, book_annotation, file_meta, file_upload, note, system, user, user_book

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(book.router)
api_router.include_router(book_annotation.router)
api_router.include_router(file_meta.router)
api_router.include_router(file_upload.router)
api_router.include_router(note.router)
api_router.include_router(system.router)
api_router.include_router(user.router)
api_router.include_router(user_book.router)
