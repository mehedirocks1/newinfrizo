from rest_framework import serializers
from apps.marketplace.models import (
    Skill, FreelancerProfile, FreelancerPortfolioItem, FreelancerReview, FreelancerApplication
)

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class FreelancerPortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerPortfolioItem
        fields = '__all__'

class FreelancerReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerReview
        fields = '__all__'

class FreelancerProfileSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.ReadOnlyField(source='user.get_full_name')
    skills = SkillSerializer(many=True, read_only=True)
    portfolio_items = FreelancerPortfolioItemSerializer(many=True, read_only=True)
    reviews = FreelancerReviewSerializer(many=True, read_only=True)

    class Meta:
        model = FreelancerProfile
        fields = '__all__'

class FreelancerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerApplication
        fields = '__all__'
        read_only_fields = ('status', 'reviewed_at', 'reviewed_by')
