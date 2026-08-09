from django.db import models
from django.contrib.auth.models import User
from apps.core.models import BaseModel
from apps.core.utils.image_optimizer import compress_and_convert_to_webp

class Skill(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    category = models.CharField(max_length=100, blank=True)

    class Meta:
        app_label = 'marketplace'
        ordering = ['name']

    def __str__(self):
        return self.name

class FreelancerProfile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='freelancer_profile')
    profile_photo = models.ImageField(upload_to="freelancers/photos/", null=True, blank=True)
    title = models.CharField(max_length=255, help_text="e.g. Senior Fullstack Django & React Specialist")
    bio = models.TextField()
    
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    daily_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    skills = models.ManyToManyField(Skill, blank=True, related_name='freelancers')
    portfolio_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    resume = models.FileField(upload_to="freelancers/resumes/", null=True, blank=True)
    
    jobs_completed_count = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    ranking_score = models.PositiveIntegerField(default=100, help_text="Higher score appears first in top-ranked sorting")
    
    is_top_rated = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)

    class Meta:
        app_label = 'marketplace'
        ordering = ['-is_top_rated', '-ranking_score', '-average_rating']

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.title}"

    def save(self, *args, **kwargs):
        if self.profile_photo and not self.profile_photo.name.endswith('.webp'):
            try:
                _ = self.profile_photo.file
                optimized = compress_and_convert_to_webp(self.profile_photo)
                if optimized:
                    self.profile_photo = optimized
            except Exception:
                pass
        super().save(*args, **kwargs)

class FreelancerPortfolioItem(models.Model):
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='portfolio_items')
    project_title = models.CharField(max_length=255)
    project_description = models.TextField(blank=True)
    project_url = models.URLField(blank=True)
    cover_image = models.ImageField(upload_to="freelancers/portfolio/", null=True, blank=True)
    completion_date = models.DateField(null=True, blank=True)

    class Meta:
        app_label = 'marketplace'

    def __str__(self):
        return f"{self.project_title} ({self.freelancer.user.username})"

    def save(self, *args, **kwargs):
        if self.cover_image and not self.cover_image.name.endswith('.webp'):
            try:
                _ = self.cover_image.file
                optimized = compress_and_convert_to_webp(self.cover_image)
                if optimized:
                    self.cover_image = optimized
            except Exception:
                pass
        super().save(*args, **kwargs)

class FreelancerReview(BaseModel):
    freelancer = models.ForeignKey(FreelancerProfile, on_delete=models.CASCADE, related_name='reviews')
    reviewer_name = models.CharField(max_length=255)
    reviewer_email = models.EmailField(blank=True)
    rating = models.PositiveIntegerField(default=5)
    review_text = models.TextField()

    class Meta:
        app_label = 'marketplace'
        ordering = ['-created_at']

    def __str__(self):
        return f"Review for {self.freelancer.user.username} ({self.rating}/5)"

class FreelancerApplication(BaseModel):
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    profile_photo = models.ImageField(upload_to="applications/photos/", null=True, blank=True)
    
    title = models.CharField(max_length=255)
    bio = models.TextField()
    expected_hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    skills_text = models.CharField(max_length=500, help_text="Comma-separated skills e.g. Django, React, PostgreSQL")
    
    portfolio_url = models.URLField(blank=True)
    resume_file = models.FileField(upload_to="applications/resumes/")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    admin_notes = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        app_label = 'marketplace'
        ordering = ['-created_at']

    def __str__(self):
        return f"Application from {self.full_name} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        if self.profile_photo and not self.profile_photo.name.endswith('.webp'):
            try:
                _ = self.profile_photo.file
                optimized = compress_and_convert_to_webp(self.profile_photo)
                if optimized:
                    self.profile_photo = optimized
            except Exception:
                pass
        super().save(*args, **kwargs)