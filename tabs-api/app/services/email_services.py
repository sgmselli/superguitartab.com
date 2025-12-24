from app.constants.email_templates import EmailTemplatesId
from app.external_services.email_client import EmailClient

class EmailService:
    def __init__(self, client: EmailClient):
        self.client = client

    def send_welcome_email(self, to_email: str, first_name: str):
        return self.client.send_email(
            template_id=EmailTemplatesId.WELCOME,
            to_email=to_email,
            data={"first_name": first_name},
        )