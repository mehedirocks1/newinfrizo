from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.catalog.views import SoftwareCategoryViewSet, SoftwareItemViewSet

router = DefaultRouter()
router.register(r'categories', SoftwareCategoryViewSet, basename='software-category')
router.register(r'items', SoftwareItemViewSet, basename='software-item')

app_name = 'catalog'

urlpatterns = [
    path('', include(router.urls)),
]
