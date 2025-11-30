from fastapi import APIRouter

from app.router.v1 import tabs, auth, user

router = APIRouter()

router.include_router(tabs.router, prefix="/tabs", tags=["tabs"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(user.router, prefix="/user", tags=["user"])