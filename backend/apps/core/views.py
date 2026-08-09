from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Sum, Count

from apps.core.models import SiteConfiguration, FinancialTransaction
from apps.core.serializers import SiteConfigurationSerializer, FinancialTransactionSerializer

class PublicSiteConfigView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        config = SiteConfiguration.objects.first()
        if not config:
            # Create default config if missing
            config = SiteConfiguration.objects.create()
        serializer = SiteConfigurationSerializer(config, context={'request': request})
        return Response(serializer.data)

class DashboardSummaryView(APIView):
    """
    Returns weekly/monthly financial metrics and platform stats for Admin / Dashboard reporting.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_income = FinancialTransaction.objects.filter(transaction_type='income').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = FinancialTransaction.objects.filter(transaction_type='expense').aggregate(Sum('amount'))['amount__sum'] or 0
        net_revenue = total_income - total_expense

        # Import lazy models to avoid circular imports
        from apps.quotes.models import QuoteRequest
        from apps.store.models import Order
        from apps.marketplace.models import FreelancerApplication, FreelancerProfile
        from apps.blog.models import BlogPost

        data = {
            'financial': {
                'total_income': float(total_income),
                'total_expense': float(total_expense),
                'net_revenue': float(net_revenue),
            },
            'counters': {
                'pending_quotes': QuoteRequest.objects.filter(status='pending').count(),
                'total_orders': Order.objects.count(),
                'pending_orders': Order.objects.filter(order_status='pending').count(),
                'pending_freelancers': FreelancerApplication.objects.filter(status='pending').count(),
                'total_freelancers': FreelancerProfile.objects.filter(is_approved=True).count(),
                'published_blogs': BlogPost.objects.filter(is_published=True).count(),
            }
        }
        return Response(data)
