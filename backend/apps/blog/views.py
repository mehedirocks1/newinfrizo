from rest_framework import viewsets, permissions, filters
from apps.blog.models import BlogCategory, BlogTag, BlogPost, BlogComment
from apps.blog.serializers import BlogCategorySerializer, BlogTagSerializer, BlogPostSerializer, BlogCommentSerializer

class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class BlogTagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogTag.objects.all()
    serializer_class = BlogTagSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'summary', 'content', 'tags__name']
    ordering_fields = ['published_at', 'views_count', 'created_at']

class BlogCommentViewSet(viewsets.ModelViewSet):
    queryset = BlogComment.objects.filter(is_approved=True)
    serializer_class = BlogCommentSerializer
    permission_classes = [permissions.AllowAny]
