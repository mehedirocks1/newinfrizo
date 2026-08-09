import logging
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from apps.core.models import SiteConfiguration

logger = logging.getLogger(__name__)

def send_system_email(subject, recipient_email, template_name, context, attachment_file=None, attachment_filename=None, copy_to_admin=True):
    """
    Utility to dispatch HTML emails with optional file attachments.
    Also sends a copy to the system admin email specified in SiteConfiguration.
    """
    site_config = SiteConfiguration.objects.first()
    sender_email = site_config.contact_email if site_config else getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@newinfrizo.com')
    admin_email = site_config.contact_email if site_config else 'admin@newinfrizo.com'

    # Inject site config into email context
    context['site_config'] = site_config
    context['site_name'] = site_config.site_name if site_config else 'NewInfrizo'

    try:
        # Render HTML message
        html_content = render_to_string(template_name, context)

        recipients = [recipient_email]
        if copy_to_admin and admin_email and admin_email != recipient_email:
            recipients.append(admin_email)

        email = EmailMessage(
            subject=f"[{context['site_name']}] {subject}",
            body=html_content,
            from_email=sender_email,
            to=recipients,
        )
        email.content_subtype = "html"

        # Attach file if provided
        if attachment_file and attachment_filename:
            if hasattr(attachment_file, 'read'):
                attachment_bytes = attachment_file.read()
                attachment_file.seek(0)
            else:
                attachment_bytes = attachment_file

            email.attach(attachment_filename, attachment_bytes, 'application/pdf')

        email.send(fail_silently=True)
        logger.info(f"Email '{subject}' sent successfully to {recipients}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email '{subject}': {e}")
        return False
