from pydantic_settings import SettingsConfigDict

from app.core.settings.base import BaseAppSettings

class DevelopmentSettings(BaseAppSettings):
    debug: bool = True
    frontend_url: str = "http://localhost"
    allowed_hosts: list[str] = ["*"]
    allow_origins: list[str] = ["*"]
    database_name: str = "guitartabsdb"
    database_host: str = "db"
    database_password: str = "password"
    database_user: str = "postgres"
    google_redirect_url: str = "http://localhost/api/v1/auth/google/callback"

    model_config = SettingsConfigDict(
        env_file='.env',
        extra="ignore"
    )