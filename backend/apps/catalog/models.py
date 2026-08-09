from django.db import models
from apps.core.models import BaseModel
from apps.core.utils.image_optimizer import compress_and_convert_to_webp

class SoftwareCategory(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    icon = models.CharField(max_length=100, blank=True, help_text="CSS icon class e.g. 'ri-code-s-slash-line'")
    description = models.TextField(blank=True)
    parent_category = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'catalog'
        verbose_name_plural = "Software Categories"

    def __str__(self):
        return self.name

class SoftwareItem(BaseModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, db_index=True)
    category = models.ForeignKey(SoftwareCategory, on_delete=models.CASCADE, related_name='softwares')
    version = models.CharField(max_length=50, default="1.0.0")
    
    short_description = models.CharField(max_length=500)
    detailed_description = models.TextField(help_text="Full Envato-style details & documentation overview")
    
    # Media
    thumbnail = models.ImageField(upload_to="software/thumbnails/")
    banner = models.ImageField(upload_to="software/banners/", null=True, blank=True)
    live_preview_url = models.URLField(blank=True, null=True)
    video_demo_url = models.URLField(blank=True, null=True)
    video_demo_file = models.FileField(upload_to="software/videos/", null=True, blank=True)
    
    # Tech Stack & Specs
    tech_stack = models.JSONField(default=list, help_text="e.g. ['Django', 'React', 'PostgreSQL']")
    frameworks = models.CharField(max_length=255, blank=True, help_text="e.g. Django 6.1, React 19, Tailwind")
    compatible_browsers = models.CharField(max_length=255, default="Chrome, Firefox, Safari, Edge")
    documentation_url = models.URLField(blank=True, null=True)
    documentation_file = models.FileField(upload_to="software/docs/", null=True, blank=True)
    
    # Pricing Licenses
    regular_price = models.DecimalField(max_digits=12, decimal_places=2, help_text="Single project license")
    extended_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Multi-client / reseller license")
    
    # Metrics
    sales_count = models.PositiveIntegerField(default=0)
    rating_average = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    is_featured = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'catalog'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} (v{self.version})"

    def save(self, *args, **kwargs):
        for field_name in ['thumbnail', 'banner']:
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

class SoftwareGalleryImage(models.Model):
    software = models.ForeignKey(SoftwareItem, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to="software/gallery/")
    caption = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        app_label = 'catalog'
        ordering = ['display_order']

    def __str__(self):
        return f"Gallery image for {self.software.title}"

    def save(self, *args, **kwargs):
        if self.image and not self.image.name.endswith('.webp'):
            try:
                _ = self.image.file
                optimized = compress_and_convert_to_webp(self.image)
                if optimized:
                    self.image = optimized
            except Exception:
                pass
        super().save(*args, **kwargs)

class SoftwareChangelog(models.Model):
    software = models.ForeignKey(SoftwareItem, on_delete=models.CASCADE, related_name='changelogs')
    version = models.CharField(max_length=50)
    release_date = models.DateField()
    change_notes = models.TextField()

    class Meta:
        app_label = 'catalog'
        ordering = ['-release_date']

    def __str__(self):
        return f"{self.software.title} - v{self.version}"

class SoftwareFeature(models.Model):
    software = models.ForeignKey(SoftwareItem, on_delete=models.CASCADE, related_name='features')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True, default="ri-check-line")

    class Meta:
        app_label = 'catalog'

    def __str__(self):
        return self.title