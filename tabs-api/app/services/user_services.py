from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions.user import UserAlreadyExists, UserIdDoesNotExist, UserEmailDoesNotExist
from app.models.user import User
from app.schema.user import UserCreate
from app.utils.auth.password import hash_password


async def get_user_by_id(user_id: int, session: AsyncSession) -> User:
    """
    Retrieve a user by their ID.

    Args:
        user_id (int): The ID of the user to retrieve.
        session (AsyncSession): The async SQLAlchemy database session.

    Returns:
        User: The User instance if found

    Raises:
        UserIdDoesNotExist: If a user with the given id does not exist.
    """
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise UserIdDoesNotExist(user_id)
    return user

async def get_user_by_email(email: str, session: AsyncSession) -> User:
    """
    Retrieve a user by their email address.

    Args:
        email (str): The email of the user to retrieve.
        session (AsyncSession): The async SQLAlchemy database session.

    Returns:
        User: The User instance if found

    Raises:
        UserEmailDoesNotExist: If a user with the given email does not exist.
    """
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise UserEmailDoesNotExist(email)
    return user

async def create_user(user_create: UserCreate, session: AsyncSession) -> User:
    """
    Service layer to create a new user.

    Args:
        user_create (UserCreate): The Pydantic schema containing user input data.
        session (AsyncSession): SQLAlchemy async session for DB operations.

    Returns:
        User: The newly created User model instance.

    Raises:
        UserAlreadyExists: If a user with the given email already exists.
    """
    email = user_create.email.strip().lower()
    hashed_password = hash_password(user_create.password)

    result = await session.execute(select(User).where(User.email == email))
    existing = result.scalars().first()
    if existing:
        raise UserAlreadyExists(email)

    user = User(
        email=email,
        password=hashed_password,
        **user_create.model_dump(exclude={"email", "password", "confirm_password"})
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)

    return user