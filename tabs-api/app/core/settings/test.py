from pydantic_settings import SettingsConfigDict

from app.core.settings.base import BaseAppSettings

class TestSettings(BaseAppSettings):
    debug: bool = True
    allowed_hosts: list[str] = ["*"]
    allow_origins: list[str] = ["*"]
    database_name: str = "guitartabsdb"
    database_host: str = "db"
    database_password: str = "password"
    database_user: str = "postgres"

    model_config = SettingsConfigDict(
        env_file='.env',
        extra="ignore"
    )