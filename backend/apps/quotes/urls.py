from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.quotes.views import QuoteRequestViewSet

router = DefaultRouter()
router.register(r'requests', QuoteRequestViewSet, basename='quote-request')

app_name = 'quotes'

urlpatterns = [
    path('', include(router.urls)),
]
