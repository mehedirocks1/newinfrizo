from rest_framework import serializers
from apps.blog.models import BlogCategory, BlogTag, BlogPost, BlogComment

class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = '__all__'

class BlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogTag
        fields = '__all__'

class BlogCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogComment
        fields = '__all__'

class BlogPostSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    author_name = serializers.ReadOnlyField(source='author.get_full_name')
    tags = BlogTagSerializer(many=True, read_only=True)
    comments = BlogCommentSerializer(many=True, read_only=True)

    class Meta:
        model = BlogPost
        fields = '__all__'
