from rest_framework import serializers
from apps.catalog.models import (
    SoftwareCategory, SoftwareItem, SoftwareGalleryImage, SoftwareChangelog, SoftwareFeature
)

class SoftwareCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareCategory
        fields = '__all__'

class SoftwareGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareGalleryImage
        fields = '__all__'

class SoftwareChangelogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareChangelog
        fields = '__all__'

class SoftwareFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwareFeature
        fields = '__all__'

class SoftwareItemSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    gallery = SoftwareGalleryImageSerializer(many=True, read_only=True)
    changelogs = SoftwareChangelogSerializer(many=True, read_only=True)
    features = SoftwareFeatureSerializer(many=True, read_only=True)

    class Meta:
        model = SoftwareItem
        fields = '__all__'
