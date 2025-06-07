from fastapi import APIRouter

from app.api.routes import auth, book, note, system, user

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(book.router)
api_router.include_router(note.router)
api_router.include_router(system.router)
api_router.include_router(user.router)
