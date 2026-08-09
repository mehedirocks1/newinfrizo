from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from apps.store.models import ProductCategory, ProductBrand, Product, Order, OrderItem
from apps.store.serializers import ProductCategorySerializer, ProductBrandSerializer, ProductSerializer, OrderSerializer

class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.filter(is_active=True)
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class ProductBrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductBrand.objects.all()
    serializer_class = ProductBrandSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'sku', 'description', 'short_description']
    ordering_fields = ['price', 'created_at', 'views_count', 'average_rating']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        order = serializer.save()
        if self.request.user.is_authenticated:
            order.client = self.request.user
            order.save()
