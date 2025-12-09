from app.core.settings.base import BaseAppSettings

class ProductionSettings(BaseAppSettings):
    debug: bool = True
    frontend_url: str = "http://superguitartab.com"
    allowed_hosts: list[str] = ["prod.api.com"]
    allow_origins: list[str] = ["prod.frontend.com"]
    google_redirect_url: str = "https://superguitartab.com/api/v1/auth/google/callback"