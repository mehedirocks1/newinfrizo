from django.contrib import admin, messages
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify
from apps.marketplace.models import (
    Skill, FreelancerProfile, FreelancerPortfolioItem, FreelancerReview, FreelancerApplication
)
from apps.core.utils.email_service import send_system_email

class FreelancerPortfolioItemInline(admin.TabularInline):
    model = FreelancerPortfolioItem
    extra = 1

class FreelancerReviewInline(admin.TabularInline):
    model = FreelancerReview
    extra = 0

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'category')

@admin.register(FreelancerProfile)
class FreelancerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'hourly_rate', 'daily_rate', 'jobs_completed_count', 'average_rating', 'is_top_rated', 'is_featured', 'is_approved')
    list_filter = ('is_top_rated', 'is_featured', 'is_approved')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'title', 'bio')
    filter_horizontal = ('skills',)
    inlines = [FreelancerPortfolioItemInline, FreelancerReviewInline]

@admin.register(FreelancerApplication)
class FreelancerApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'title', 'expected_hourly_rate', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('full_name', 'email', 'title', 'skills_text')
    actions = ['approve_application_and_create_profile']

    @admin.action(description="Approve & Create Freelancer Profile")
    def approve_application_and_create_profile(self, request, queryset):
        approved_count = 0
        for app in queryset:
            if app.status != 'approved':
                # 1. Create or fetch User
                username = slugify(app.full_name).replace('-', '_')
                user, created = User.objects.get_or_create(
                    email=app.email,
                    defaults={
                        'username': username,
                        'first_name': app.full_name.split()[0],
                        'last_name': ' '.join(app.full_name.split()[1:]) if len(app.full_name.split()) > 1 else ''
                    }
                )

                # 2. Create FreelancerProfile
                profile, p_created = FreelancerProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'title': app.title,
                        'bio': app.bio,
                        'hourly_rate': app.expected_hourly_rate,
                        'portfolio_url': app.portfolio_url,
                        'resume': app.resume_file,
                        'profile_photo': app.profile_photo,
                        'is_approved': True
                    }
                )

                # 3. Attach Skills
                if app.skills_text:
                    skill_names = [s.strip() for s in app.skills_text.split(',') if s.strip()]
                    for s_name in skill_names:
                        skill_obj, _ = Skill.objects.get_or_create(
                            name=s_name,
                            defaults={'slug': slugify(s_name)}
                        )
                        profile.skills.add(skill_obj)

                # 4. Update status
                app.status = 'approved'
                app.reviewed_at = timezone.now()
                app.reviewed_by = request.user
                app.save()

                # 5. Send Notification Email
                send_system_email(
                    subject="Congratulations! Your Freelancer Application is Approved",
                    recipient_email=app.email,
                    template_name="emails/freelancer_approved.html",
                    context={'applicant_name': app.full_name, 'title': app.title},
                    copy_to_admin=True
                )
                approved_count += 1

        self.message_user(request, f"Approved {approved_count} applications and created freelancer profiles.", messages.SUCCESS)