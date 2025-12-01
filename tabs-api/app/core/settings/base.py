from pydantic_settings import BaseSettings
from typing import Optional, Any
import os

from app.constants.environment import AppEnvTypes

def get_environment_type() -> AppEnvTypes:
    environment = os.getenv("APP_ENV", "DEVELOPMENT").upper()
    try:
        return AppEnvTypes(environment)
    except ValueError:
        return AppEnvTypes.DEVELOPMENT

class BaseAppSettings(BaseSettings):
    app_env: AppEnvTypes = get_environment_type()
    api_v1_prefix: str = '/api/v1'
    title: str = 'superguitartabs.com API'
    docs_url: str = '/docs'
    version: str = '1.0.0'
    allow_credentials: bool = True
    allow_methods: list[str] = ["*"]
    allow_headers: list[str] = ["*"]
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30
    jwt_encryption_algorithm: str = "HS256"

    debug: Optional[bool] = None
    frontend_url: Optional[str] = None
    access_secret_key: Optional[str] = None
    refresh_secret_key: Optional[str] = None
    session_secret_key: Optional[str] = None
    google_client_secret: Optional[str] = None
    google_client_id: Optional[str] = None
    allowed_hosts: Optional[list[str]] = None
    allow_origins: Optional[list[str]] = []
    database_name: Optional[str] = None
    database_host: Optional[str] = None
    database_password: Optional[str] = None
    database_user: Optional[str] = None
    digital_ocean_bucket_secret_key: Optional[str] = None
    digital_ocean_bucket_access_key_id: Optional[str] = None
    digital_ocean_bucket_name: Optional[str] = None
    digital_ocean_bucket_region_name: Optional[str] = None

    @property
    def async_driver_database_url(self) -> str:
        return f"postgresql+asyncpg://{self.database_user}:{self.database_password}@{self.database_host}:5432/{self.database_name}"

    @property
    def sync_driver_database_url(self) -> str:
        return f"postgresql+psycopg2://{self.database_user}:{self.database_password}@{self.database_host}:5432/{self.database_name}"

    @property
    def fast_api_kwargs(self) -> dict[str, Any]:
        return {
            "debug": self.debug,
            "docs_url": self.docs_url,
            "title": self.title,
            "version": self.version
        }
