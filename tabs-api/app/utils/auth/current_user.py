from fastapi import Cookie, Depends, HTTPException
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.exceptions.user import UserIdDoesNotExist
from app.models.user import User
from app.constants.http_error_codes import (
    HTTP_401_UNAUTHORIZED,
    HTTP_404_NOT_FOUND
)
from app.services.user_services import get_user_by_id
from app.utils.auth.jwt import decode_access_token
from app.utils.logging import Logger, LogLevel

async def get_current_user(access_token: str = Cookie(None), session: AsyncSession = Depends(get_session)) -> User:
    if access_token is None:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="You must be authorized to access.", headers={"WWW-Authenticate": "Bearer"})

    try:
        payload = decode_access_token(access_token)
    except JWTError as e:
        Logger.log(LogLevel.ERROR, f"Error decoding access token {str(e)}")
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="You must be authorized to access.", headers={"WWW-Authenticate": "Bearer"})

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="You must be authorized to access.", headers={"WWW-Authenticate": "Bearer"})

    try:
        user = await get_user_by_id(int(user_id), session)
    except UserIdDoesNotExist as e:
        Logger.log(LogLevel.ERROR, f"User ID `{user_id}` from access token sub does not exist")
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=str(e))

    return user
