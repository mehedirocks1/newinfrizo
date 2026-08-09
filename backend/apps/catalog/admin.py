from django.contrib import admin
from apps.catalog.models import (
    SoftwareCategory, SoftwareItem, SoftwareGalleryImage, SoftwareChangelog, SoftwareFeature
)

class SoftwareGalleryImageInline(admin.TabularInline):
    model = SoftwareGalleryImage
    extra = 1

class SoftwareChangelogInline(admin.TabularInline):
    model = SoftwareChangelog
    extra = 1

class SoftwareFeatureInline(admin.TabularInline):
    model = SoftwareFeature
    extra = 1

@admin.register(SoftwareCategory)
class SoftwareCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent_category', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')

@admin.register(SoftwareItem)
class SoftwareItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'version', 'regular_price', 'extended_price', 'sales_count', 'is_featured', 'is_active')
    list_filter = ('category', 'is_featured', 'is_trending', 'is_active')
    search_fields = ('title', 'short_description', 'tech_stack', 'frameworks')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [SoftwareGalleryImageInline, SoftwareChangelogInline, SoftwareFeatureInline]

    fieldsets = (
        ('Software Information', {
            'fields': ('title', 'slug', 'category', 'version', 'short_description', 'detailed_description')
        }),
        ('Media & Previews', {
            'fields': ('thumbnail', 'banner', 'live_preview_url', 'video_demo_url', 'video_demo_file')
        }),
        ('Tech Stack & Docs', {
            'fields': ('tech_stack', 'frameworks', 'compatible_browsers', 'documentation_url', 'documentation_file')
        }),
        ('Pricing & Status', {
            'fields': ('regular_price', 'extended_price', 'sales_count', 'rating_average', 'is_featured', 'is_trending', 'is_active')
        }),
    )