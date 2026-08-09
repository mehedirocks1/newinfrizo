from django.contrib import admin
from apps.blog.models import BlogCategory, BlogTag, BlogPost, BlogComment

class BlogCommentInline(admin.TabularInline):
    model = BlogComment
    extra = 0

@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')

@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'views_count', 'is_published', 'published_at')
    list_filter = ('is_published', 'is_featured', 'category', 'published_at')
    search_fields = ('title', 'summary', 'content', 'meta_title', 'meta_keywords')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)
    inlines = [BlogCommentInline]

    fieldsets = (
        ('Article Details', {
            'fields': ('title', 'slug', 'category', 'author', 'tags', 'featured_image', 'summary', 'content', 'read_time_minutes', 'is_published', 'is_featured', 'published_at')
        }),
        ('SEO & Social Share (OpenGraph)', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords', 'canonical_url', 'og_image')
        }),
    )

@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author_name', 'author_email', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('author_name', 'author_email', 'comment')