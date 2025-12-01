from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator, ValidationInfo
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
    confirm_password:  Optional[str] = None

    @field_validator("first_name")
    def validate_first_name(cls, v: str) -> str:
        if " " in v:
            raise ValueError("First name cannot contain spaces")
        if len(v) < 1:
            raise ValueError("First name must be at least 1 character")
        if len(v) > 50:
            raise ValueError("First name must be less than 50 characters")
        if not re.match(r'^[A-Za-z0-9._-]+$', v):
            raise ValueError("First name can only contain letters, numbers, periods, underscores, and hyphens")
        return v

    @field_validator("last_name")
    def validate_last_name(cls, v: str) -> str:
        if " " in v:
            raise ValueError("Last name cannot contain spaces")
        if len(v) < 1:
            raise ValueError("Last name must be at least 1 character")
        if len(v) > 50:
            raise ValueError("Last name must be less than 50 characters")
        if not re.match(r'^[A-Za-z0-9._-]+$', v):
            raise ValueError("Last name can only contain letters, numbers, periods, underscores, and hyphens")
        return v

    @field_validator("password")
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if len(v) > 128:
            raise ValueError("Password must be less than or equal to 128 characters")
        if " " in v:
            raise ValueError("Password cannot contain spaces")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        return v

    @field_validator("confirm_password")
    def validate_confirm_password(cls, v: str, info: ValidationInfo) -> str:
        password = info.data.get("password")
        if password and v != password:
            raise ValueError("Passwords do not match")
        return v
