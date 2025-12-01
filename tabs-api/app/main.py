from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware

from app.router.v1.router import router
from app.core.config import settings

def create_app() -> FastAPI:
    _app = FastAPI(**settings.fast_api_kwargs)
    _app.include_router(router, prefix=settings.api_v1_prefix)

    _app.add_middleware(
        SessionMiddleware,
        secret_key=settings.session_secret_key
    )

    return _app

app = create_app()
