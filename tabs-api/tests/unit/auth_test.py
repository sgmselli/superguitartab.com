import pytest
from fastapi import status, HTTPException
from jose import JWTError

from app.router.v1.auth import password_auth
from app.utils.auth import current_user
from app.exceptions.user import UserEmailDoesNotExist, UserIdDoesNotExist


class FakeUser:
    def __init__(self, user_id: int = 1, email: str = "user@example.com"):
        self.id = user_id
        self.email = email
        self.password = "hashed-password"
        self.first_name = "Test"
        self.last_name = "User"


@pytest.mark.asyncio
async def test_login_success_sets_tokens_and_returns_user(client, monkeypatch):
    user = FakeUser()

    async def mock_get_user_by_email(email, session):
        return user

    monkeypatch.setattr(password_auth, "get_user_by_email", mock_get_user_by_email)
    monkeypatch.setattr(password_auth, "verify_password", lambda plain, hashed: True)
    monkeypatch.setattr(password_auth, "create_access_token", lambda data: "access-token")
    monkeypatch.setattr(password_auth, "create_refresh_token", lambda data: "refresh-token")

    response = await client.post(
        "auth/login",
        data={"username": user.email, "password": "secret-password"},
    )

    assert response.status_code == status.HTTP_200_OK
    payload = response.json()
    assert payload["email"] == user.email
    assert payload["first_name"] == user.first_name
    assert response.cookies["access_token"] == "access-token"
    assert response.cookies["refresh_token"] == "refresh-token"


@pytest.mark.asyncio
async def test_login_nonexistent_email_returns_unauthorized(client, monkeypatch):
    async def mock_get_user_by_email(email, session):
        raise UserEmailDoesNotExist(email)

    monkeypatch.setattr(password_auth, "get_user_by_email", mock_get_user_by_email)

    response = await client.post(
        "auth/login",
        data={"username": "missing@example.com", "password": "irrelevant"},
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Incorrect username or password."


@pytest.mark.asyncio
async def test_login_incorrect_password_returns_unauthorized(client, monkeypatch):
    user = FakeUser()

    async def mock_get_user_by_email(email, session):
        return user

    monkeypatch.setattr(password_auth, "get_user_by_email", mock_get_user_by_email)
    monkeypatch.setattr(password_auth, "verify_password", lambda plain, hashed: False)

    response = await client.post(
        "auth/login",
        data={"username": user.email, "password": "wrong-password"},
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["detail"] == "Incorrect username or password."


@pytest.mark.asyncio
async def test_refresh_sets_new_access_token_from_cookie(client, monkeypatch):
    monkeypatch.setattr(
        password_auth,
        "decode_refresh_token",
        lambda token: {"sub": "1"},
    )
    monkeypatch.setattr(
        password_auth,
        "create_access_token",
        lambda data: "new-access-token",
    )

    response = await client.post(
        "auth/refresh",
        cookies={"refresh_token": "valid-refresh-token"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.cookies["access_token"] == "new-access-token"


@pytest.mark.asyncio
async def test_refresh_missing_cookie_returns_unauthorized(client):
    response = await client.post("auth/refresh")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_refresh_invalid_token_returns_unauthorized(client, monkeypatch):
    def raise_jwt_error(token):
        raise JWTError("bad token")

    monkeypatch.setattr(password_auth, "decode_refresh_token", raise_jwt_error)

    response = await client.post(
        "auth/refresh",
        cookies={"refresh_token": "invalid"},
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_logout_invokes_token_cleanup(client, monkeypatch):
    called = {"deleted": False}

    def mock_delete_tokens(response):
        called["deleted"] = True

    monkeypatch.setattr(password_auth, "delete_tokens", mock_delete_tokens)

    response = await client.post("auth/logout")

    assert response.status_code == status.HTTP_200_OK
    assert called["deleted"] is True


@pytest.mark.asyncio
async def test_get_current_user_returns_user(monkeypatch):
    user = FakeUser(user_id=5)

    monkeypatch.setattr(
        current_user,
        "decode_access_token",
        lambda token: {"sub": user.id},
    )

    async def mock_get_user_by_id(user_id, session):
        return user

    monkeypatch.setattr(current_user, "get_user_by_id", mock_get_user_by_id)

    result = await current_user.get_current_user(access_token="token", session=None)
    assert result is user


@pytest.mark.asyncio
async def test_get_current_user_missing_token_raises(monkeypatch):
    with pytest.raises(HTTPException) as excinfo:
        await current_user.get_current_user(access_token=None, session=None)

    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_get_current_user_invalid_token_raises(monkeypatch):
    def raise_jwt_error(token):
        raise JWTError("invalid")

    monkeypatch.setattr(current_user, "decode_access_token", raise_jwt_error)

    with pytest.raises(HTTPException) as excinfo:
        await current_user.get_current_user(access_token="bad", session=None)

    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_get_current_user_missing_sub_raises(monkeypatch):
    monkeypatch.setattr(
        current_user,
        "decode_access_token",
        lambda token: {},
    )

    with pytest.raises(HTTPException) as excinfo:
        await current_user.get_current_user(access_token="no-sub", session=None)

    assert excinfo.value.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.asyncio
async def test_get_current_user_unknown_user_raises(monkeypatch):
    monkeypatch.setattr(
        current_user,
        "decode_access_token",
        lambda token: {"sub": 99},
    )

    async def mock_get_user_by_id(user_id, session):
        raise UserIdDoesNotExist(user_id)

    monkeypatch.setattr(current_user, "get_user_by_id", mock_get_user_by_id)

    with pytest.raises(HTTPException) as excinfo:
        await current_user.get_current_user(access_token="token", session=None)

    assert excinfo.value.status_code == status.HTTP_404_NOT_FOUND

