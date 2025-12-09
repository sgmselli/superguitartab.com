from fastapi import APIRouter, Depends, HTTPException, Response, Request

from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import RedirectResponse
from starlette.status import HTTP_400_BAD_REQUEST

from app.core.config import settings
from app.db.session import get_session
from app.exceptions.user import UserGoogleIdDoesNotExist, UserEmailDoesNotExist
from app.schema.user import UserResponse, UserCreate
from app.services.user_services import get_user_by_google_id, create_user_without_password, get_user_by_email
from app.utils.auth.jwt import create_access_token, create_refresh_token, store_tokens
from app.utils.logging import Logger, LogLevel
from app.constants.http_error_codes import (
    HTTP_200_OK,
    HTTP_302_FOUND
)
from app.auth.oauth.google_oauth import google_oath

router = APIRouter()

@router.get('/login', response_model=UserResponse, status_code=HTTP_200_OK)
async def auth_google_login(request: Request):
    return await google_oath.authorize_redirect(request, settings.google_redirect_url)

@router.get('/callback', response_model=UserResponse, status_code=HTTP_200_OK)
async def auth_google_callback(
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    try:
        token = await google_oath.authorize_access_token(request)

        google_user = token.get("userinfo")
        if google_user is None:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Failed to retrieve Google user profile")

        google_id = google_user["sub"]
        email = google_user.get("email")
        first_name = google_user.get("given_name")
        last_name = google_user.get("family_name")

        try:
            user = await get_user_by_google_id(google_id, session)
        except UserGoogleIdDoesNotExist:
            try:
                user = await get_user_by_email(email, session)
                user.google_id = google_id
                await session.commit()
                await session.refresh(user)
            except UserEmailDoesNotExist:
                Logger.log(LogLevel.INFO, "Google ID does not exist for user. Creating user.")
                user_create = UserCreate(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    google_id=google_id
                )
                user = await create_user_without_password(user_create, session)

        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        redirect = RedirectResponse(
            url=f"{settings.frontend_url}/account",
            status_code=HTTP_302_FOUND
        )

        store_tokens(redirect, access_token, refresh_token)

        return redirect


    except Exception as e:
        Logger.log( LogLevel.ERROR, f"Google OAuth callback error: {str(e)}")
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Google authentication failed")