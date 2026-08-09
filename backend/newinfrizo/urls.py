"""
URL configuration for newinfrizo project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Custom Admin Site Headers
admin.site.site_header = "NewInfrizo Soft UI Engine"
admin.site.site_title = "NewInfrizo Admin Portal"
admin.site.index_title = "Dashboard Management & Analytics"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('install/', include('apps.installer.urls')),
    
    # REST API v1 Endpoints
    path('api/v1/core/', include('apps.core.urls')),
    path('api/v1/catalog/', include('apps.catalog.urls')),
    path('api/v1/quotes/', include('apps.quotes.urls')),
    path('api/v1/store/', include('apps.store.urls')),
    path('api/v1/marketplace/', include('apps.marketplace.urls')),
    path('api/v1/blog/', include('apps.blog.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
