from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from apps.quotes.models import QuoteRequest, QuoteProposal
from apps.quotes.serializers import QuoteRequestSerializer, QuoteProposalSerializer
from apps.core.utils.email_service import send_system_email

class QuoteRequestViewSet(viewsets.ModelViewSet):
    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        quote = serializer.save()
        if self.request.user.is_authenticated:
            quote.client = self.request.user
            quote.save()

        # Send confirmation email to client & copy to admin
        context = {
            'quote': quote,
            'client_name': quote.client_name,
            'project_title': quote.project_title,
        }
        send_system_email(
            subject=f"Quote Request Received #{quote.quote_number}",
            recipient_email=quote.client_email,
            template_name="emails/quote_received.html",
            context=context,
            copy_to_admin=True
        )
