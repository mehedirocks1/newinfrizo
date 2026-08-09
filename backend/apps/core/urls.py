from django.urls import path
from apps.core.views import PublicSiteConfigView, DashboardSummaryView

app_name = 'core'

urlpatterns = [
    path('settings/', PublicSiteConfigView.as_view(), name='site-settings'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
]
