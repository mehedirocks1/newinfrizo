from rest_framework import viewsets, permissions, filters
from apps.catalog.models import SoftwareCategory, SoftwareItem
from apps.catalog.serializers import SoftwareCategorySerializer, SoftwareItemSerializer

class SoftwareCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SoftwareCategory.objects.filter(is_active=True)
    serializer_class = SoftwareCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class SoftwareItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SoftwareItem.objects.filter(is_active=True)
    serializer_class = SoftwareItemSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'short_description', 'detailed_description', 'frameworks']
    ordering_fields = ['regular_price', 'sales_count', 'rating_average', 'created_at']
