from typing import Optional
from pydantic import BaseModel, field_validator

from app.constants.genre import Genre
from app.constants.style import Style
from app.constants.difficulty_level import DifficultyLevel

class TabResponse(BaseModel):
    id: int
    song_name: str
    artist: Optional[str]
    album: Optional[str]
    genre: Optional[Genre]
    style: Optional[Style]
    difficulty: Optional[DifficultyLevel]
    description: str
    lyrics_included: bool
    file_name: str
    file_url: str | None = None

    model_config = {"from_attributes": True}

class TabFileUrlResponse(BaseModel):
    file_url: str

class TabCreate(BaseModel):
    song_name: str
    artist: str
    album: str
    genre: Genre
    style: Style
    difficulty: DifficultyLevel
    lyrics_included: bool
    file_key: str
    file_name: str

    @field_validator("song_name")
    def validate_song_name(cls, v: str) -> str:
        if len(v) < 1:
            raise ValueError("Song name must be at least 1 character")
        if len(v) > 50:
            raise ValueError("Song name must be less than 50 characters")
        return v
    
    @field_validator("artist")
    def validate_artist_name(cls, v: str) -> str:
        if len(v) < 1:
            raise ValueError("Artist name must be at least 1 character")
        if len(v) > 50:
            raise ValueError("Artist name must be less than 50 characters")
        return v

    @field_validator("album")
    def validate_album_name(cls, v: str) -> str:
        if len(v) < 1:
            raise ValueError("Album name must be at least 1 character")
        if len(v) > 50:
            raise ValueError("Album name must be less than 50 characters")
        return v

    @field_validator("file_key")
    def validate_file_key(cls, v: str) -> str:
        if not v or len(v.strip()) == 0:
            raise ValueError("file_key cannot be empty")
        if " " in v:
            raise ValueError("file_key cannot contain spaces")
        if len(v) > 255:
            raise ValueError("file_key must be less than 255 characters")
        return v

    @field_validator("file_name")
    def validate_file_name(cls, v: str) -> str:
        if not v or len(v.strip()) == 0:
            raise ValueError("file_name cannot be empty")
        allowed_extensions = [".pdf"]
        if not any(v.lower().endswith(ext) for ext in allowed_extensions):
            raise ValueError(f"file_name must end with one of {allowed_extensions}")
        return v