from rest_framework import viewsets, permissions, filters
from apps.marketplace.models import Skill, FreelancerProfile, FreelancerApplication
from apps.marketplace.serializers import SkillSerializer, FreelancerProfileSerializer, FreelancerApplicationSerializer

class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [permissions.AllowAny]

class FreelancerProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FreelancerProfile.objects.filter(is_approved=True)
    serializer_class = FreelancerProfileSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'bio', 'user__first_name', 'user__last_name', 'skills__name']
    ordering_fields = ['hourly_rate', 'ranking_score', 'average_rating', 'jobs_completed_count']

class FreelancerApplicationViewSet(viewsets.ModelViewSet):
    queryset = FreelancerApplication.objects.all()
    serializer_class = FreelancerApplicationSerializer
    permission_classes = [permissions.AllowAny]
