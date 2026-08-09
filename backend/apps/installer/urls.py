from django.urls import path
from . import views

urlpatterns = [
    path('', views.install_page, name='install_page'),
    path('api/test-db/', views.api_test_db, name='api_test_db'),
    path('api/run/', views.api_run_installation, name='api_run_installation'),
    path('api/reset/', views.api_reset_installation, name='api_reset_installation'),
]