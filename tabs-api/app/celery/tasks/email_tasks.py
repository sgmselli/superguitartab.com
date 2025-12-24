from app.celery.task_queue import celery_task_queue
from app.external_services.email_client import EmailClient, email_client
from app.services.email_services import EmailService

@celery_task_queue.task(name="task_send_welcome_email")
def task_send_welcome_email(to_email: str, first_name: str):
    EmailService(email_client).send_welcome_email(to_email, first_name)
    print(f"Sent welcome email to {to_email}.")