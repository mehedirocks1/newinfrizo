from django.contrib import admin
from apps.core.models import SiteConfiguration, FinancialTransaction

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'contact_email', 'contact_phone', 'currency_code', 'updated_at')
    fieldsets = (
        ('General Branding & Identity', {
            'fields': ('site_name', 'company_tagline', 'site_logo', 'dark_logo', 'site_favicon', 'contact_email', 'contact_phone', 'support_email', 'address', 'currency_symbol', 'currency_code')
        }),
        ('Letterhead & Accounting Settings', {
            'fields': ('letterhead_header_logo', 'company_tax_id', 'bank_details', 'letterhead_footer_text', 'digital_signature')
        }),
        ('SEO & Metadata Settings', {
            'fields': ('default_meta_title', 'default_meta_description', 'default_meta_keywords', 'default_og_image')
        }),
        ('Webmasters & Analytics Integrations', {
            'fields': ('google_site_verification', 'google_analytics_id', 'google_tag_manager_id', 'custom_header_scripts', 'custom_footer_scripts', 'robots_txt_content')
        }),
        ('Social Links', {
            'fields': ('social_facebook', 'social_twitter', 'social_linkedin', 'social_github', 'social_youtube')
        }),
    )

    def has_add_permission(self, request):
        # Limit to single site config instance
        if SiteConfiguration.objects.exists():
            return False
        return super().has_add_permission(request)

@admin.register(FinancialTransaction)
class FinancialTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_number', 'transaction_type', 'category', 'amount', 'currency', 'payment_method', 'transaction_date')
    list_filter = ('transaction_type', 'payment_method', 'reference_type', 'transaction_date')
    search_fields = ('transaction_number', 'category', 'reference_id', 'notes')
    date_hierarchy = 'transaction_date'