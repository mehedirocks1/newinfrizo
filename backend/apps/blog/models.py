from django.db import models
from django.contrib.auth.models import User
from apps.core.models import BaseModel
from apps.core.utils.image_optimizer import compress_and_convert_to_webp

class BlogCategory(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField(blank=True)

    class Meta:
        app_label = 'blog'
        verbose_name_plural = "Blog Categories"

    def __str__(self):
        return self.name

class BlogTag(BaseModel):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True, db_index=True)

    class Meta:
        app_label = 'blog'

    def __str__(self):
        return self.name

class BlogPost(BaseModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, db_index=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, related_name='posts')
    tags = models.ManyToManyField(BlogTag, blank=True, related_name='posts')
    
    featured_image = models.ImageField(upload_to="blog/images/")
    summary = models.TextField(help_text="Short summary for article listings")
    content = models.TextField(help_text="Full rich text CKEditor HTML content")
    
    read_time_minutes = models.PositiveIntegerField(default=5)
    views_count = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False, db_index=True)
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)

    # Enterprise SEO & OpenGraph Settings
    meta_title = models.CharField(max_length=255, blank=True, help_text="SEO Meta Title (Default: Post Title)")
    meta_description = models.TextField(blank=True, help_text="SEO Meta Description")
    meta_keywords = models.CharField(max_length=255, blank=True, help_text="Comma-separated keywords")
    canonical_url = models.URLField(blank=True, null=True)
    og_image = models.ImageField(upload_to="blog/og/", null=True, blank=True)

    class Meta:
        app_label = 'blog'
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        for field_name in ['featured_image', 'og_image']:
            image_attr = getattr(self, field_name)
            if image_attr and not image_attr.name.endswith('.webp'):
                try:
                    _ = image_attr.file
                    optimized = compress_and_convert_to_webp(image_attr)
                    if optimized:
                        setattr(self, field_name, optimized)
                except Exception:
                    pass
        super().save(*args, **kwargs)

class BlogComment(BaseModel):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=255)
    author_email = models.EmailField()
    comment = models.TextField()
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    is_approved = models.BooleanField(default=True)

    class Meta:
        app_label = 'blog'
        ordering = ['-created_at']

    def __str__(self):
        return f"Comment by {self.author_name} on {self.post.title}"