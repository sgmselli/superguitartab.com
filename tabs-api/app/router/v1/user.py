from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_session
from app.exceptions.user import UserAlreadyExists
from app.schema.tab import TabResponse
from app.schema.user import UserResponse, UserCreate
from app.constants.http_error_codes import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_404_NOT_FOUND
)
import app.services.user_services as user_services
from app.models.user import User
from app.utils.auth.current_user import get_current_user

router = APIRouter()

@router.get("/current", response_model=UserResponse)
async def get_current_user_data(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/register", response_model=UserResponse, status_code=HTTP_201_CREATED)
async def register_user(user_create: UserCreate, session: AsyncSession = Depends(get_session)):
    """
        API route to register a new user account.

        Args:
            user_create (UserCreate): The input payload containing the user's
                registration information (email, password, and other optional fields).
            session (AsyncSession): The async SQLAlchemy session injected via FastAPI
                dependency to perform database operations.

        Returns:
            UserResponse: A serialized representation of the newly created user.

        Raises:
            HTTPException: Returned with status code 400 if the email is already
                registered.
        """
    try:
        user = await user_services.create_user_with_password(user_create, session)
    except UserAlreadyExists as e:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=str(e))
    return UserResponse.model_validate(user)

@router.get("/current/downloads", status_code=HTTP_200_OK, response_model=list[TabResponse])
async def get_users_downloaded_tabs(current_user: User = Depends(get_current_user), session: AsyncSession = Depends(get_session)):
    tabs = await user_services.get_users_downloaded_tabs(current_user, session)
    return  [TabResponse.model_validate(tab) for tab in tabs]


