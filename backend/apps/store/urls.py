from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.store.views import ProductCategoryViewSet, ProductBrandViewSet, ProductViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet, basename='store-category')
router.register(r'brands', ProductBrandViewSet, basename='store-brand')
router.register(r'products', ProductViewSet, basename='store-product')
router.register(r'orders', OrderViewSet, basename='store-order')

app_name = 'store'

urlpatterns = [
    path('', include(router.urls)),
]
