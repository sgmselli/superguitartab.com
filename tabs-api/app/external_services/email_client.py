from sib_api_v3_sdk import ApiClient, Configuration, TransactionalEmailsApi, SendSmtpEmail
from typing import Optional

from app.constants.email_templates import EmailTemplatesId
from app.core.config import settings
from app.utils.logging import Logger, LogLevel

class EmailClient:
    
    def __init__(self):
        config = Configuration()
        config.api_key["api-key"] = settings.brevo_api_key
        self.from_name = "Superguitartab.com"
        self.from_email = settings.from_email
        self.client = TransactionalEmailsApi(ApiClient(config))

    def send_email(self, template_id: EmailTemplatesId, to_email: str, data: Optional[dict[str, str]] = None):
        message = SendSmtpEmail(
            sender={"email": self.from_email, "name": self.from_name},
            to=[{"email": to_email}],
            template_id=template_id.value
        )
        if data:
            message.params = data
        try:
            response = self.client.send_transac_email(message)
            Logger.log(LogLevel.INFO, f"status code: {response.status_code}, body: {response.body}, headers: {response.headers}")
        except Exception as e:
            Logger.log(LogLevel.ERROR, str(e))

email_client = EmailClient()