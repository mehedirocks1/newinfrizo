from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.marketplace.views import SkillViewSet, FreelancerProfileViewSet, FreelancerApplicationViewSet

router = DefaultRouter()
router.register(r'skills', SkillViewSet, basename='marketplace-skill')
router.register(r'freelancers', FreelancerProfileViewSet, basename='marketplace-freelancer')
router.register(r'applications', FreelancerApplicationViewSet, basename='marketplace-application')

app_name = 'marketplace'

urlpatterns = [
    path('', include(router.urls)),
]
