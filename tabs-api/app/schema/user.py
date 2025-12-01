from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator, ValidationInfo
from pydantic_core import PydanticCustomError
import re


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    google_id: Optional[str] = None
    password: Optional[str] = None
    confirm_password: Optional[str] = None

    @field_validator("first_name")
    def validate_first_name(cls, v: str):
        if " " in v:
            raise PydanticCustomError(
                "first_name_spaces",
                "First name cannot contain spaces"
            )
        if len(v) < 1:
            raise PydanticCustomError(
                "first_name_short",
                "First name must be at least 1 character"
            )
        if len(v) > 50:
            raise PydanticCustomError(
                "first_name_long",
                "First name must be less than 50 characters"
            )
        if not re.match(r"^[A-Za-z0-9._-]+$", v):
            raise PydanticCustomError(
                "first_name_invalid",
                "First name can only contain letters, numbers, periods, underscores, and hyphens"
            )
        return v

    @field_validator("last_name")
    def validate_last_name(cls, v: str):
        if " " in v:
            raise PydanticCustomError(
                "last_name_spaces",
                "Last name cannot contain spaces"
            )
        if len(v) < 1:
            raise PydanticCustomError(
                "last_name_short",
                "Last name must be at least 1 character"
            )
        if len(v) > 50:
            raise PydanticCustomError(
                "last_name_long",
                "Last name must be less than 50 characters"
            )
        if not re.match(r"^[A-Za-z0-9._-]+$", v):
            raise PydanticCustomError(
                "last_name_invalid",
                "Last name can only contain letters, numbers, periods, underscores, and hyphens"
            )
        return v

    @field_validator("password")
    def validate_password(cls, v: Optional[str], info: ValidationInfo):
        google_id = info.data.get("google_id")

        # Google auth user → no password needed
        if google_id and (v is None or v == ""):
            return v

        if not v:
            raise PydanticCustomError(
                "password_required",
                "Password is required"
            )

        if len(v) < 8:
            raise PydanticCustomError(
                "password_short",
                "Password must be at least 8 characters"
            )
        if len(v) > 128:
            raise PydanticCustomError(
                "password_long",
                "Password must be less than or equal to 128 characters"
            )
        if " " in v:
            raise PydanticCustomError(
                "password_spaces",
                "Password cannot contain spaces"
            )
        if not re.search(r"[A-Z]", v):
            raise PydanticCustomError(
                "password_uppercase",
                "Password must contain at least one uppercase letter"
            )
        if not re.search(r"[a-z]", v):
            raise PydanticCustomError(
                "password_lowercase",
                "Password must contain at least one lowercase letter"
            )
        if not re.search(r"\d", v):
            raise PydanticCustomError(
                "password_digit",
                "Password must contain at least one number"
            )
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise PydanticCustomError(
                "password_special",
                "Password must contain at least one special character"
            )
        return v

    @field_validator("confirm_password")
    def validate_confirm_password(cls, v: Optional[str], info: ValidationInfo):
        password = info.data.get("password")
        google_id = info.data.get("google_id")

        if google_id:
            return v

        if not password:
            return v

        if v != password:
            raise PydanticCustomError(
                "password_mismatch",
                "Passwords do not match"
            )

        return v