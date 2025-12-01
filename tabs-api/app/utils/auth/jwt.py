from typing import Any

from fastapi import Response
from jose import jwt
from datetime import datetime, timedelta, timezone

from app.core.config import settings

def create_access_token(data: dict) -> str:
    """
    Create a JWT access token.

    Args:
        data (dict): The payload data to encode in the token.

    Returns:
        str: Encoded JWT access token.
    """
    data_to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    data_to_encode.update({"exp": expire})
    return jwt.encode(data_to_encode, settings.access_secret_key, algorithm=settings.jwt_encryption_algorithm)

def create_refresh_token(data: dict) -> str:
    """
        Create a JWT refresh token.

        Args:
            data (dict): The payload data to encode in the token.

        Returns:
            str: Encoded JWT refresh token.
        """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.refresh_secret_key, algorithm=settings.jwt_encryption_algorithm)

def decode_access_token(token: str) ->  dict[str, Any]:
    """
    Decode a JWT access token and return its payload.

    Args:
        token (str): The JWT access token to decode.

    Returns:
        dict[str, Any]: Decoded token payload.
    """
    return jwt.decode(token, settings.access_secret_key, algorithms=[settings.jwt_encryption_algorithm])

def decode_refresh_token(token: str) -> dict[str, Any]:
    """
    Decode a JWT refresh token and return its payload.

    Args:
        token (str): The JWT refresh token to decode.

    Returns:
        dict[str, Any]: Decoded token payload.
    """
    return jwt.decode(token, settings.refresh_secret_key, algorithms=[settings.jwt_encryption_algorithm])

def store_tokens(response: Response, access_token: str, refresh_token: str) -> None:
    """
    Store both access and refresh tokens in response cookies.

    Args:
        response (Response): FastAPI Response object.
        access_token (str): JWT access token to store.
        refresh_token (str): JWT refresh token to store.
    """
    store_access_token(response, access_token)
    store_refresh_token(response, refresh_token)

def store_access_token(response: Response, access_token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=60 * settings.access_token_expire_minutes
    )

def store_refresh_token(response: Response, refresh_token: str) -> None:
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite='lax',
        max_age=60 * 60 * 24 * settings.refresh_token_expire_days
    )

def delete_tokens(response: Response) -> None:
    delete_access_token(response)
    delete_refresh_token(response)

def delete_access_token(response: Response) -> None:
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )

def delete_refresh_token(response: Response) -> None:
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )


