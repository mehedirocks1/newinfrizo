from django.db import models
from apps.core.utils.image_optimizer import compress_and_convert_to_webp

class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        app_label = 'core'

class SiteConfiguration(BaseModel):
    site_name = models.CharField(max_length=255, default="NewInfrizo")
    company_tagline = models.CharField(max_length=255, default="Next-Gen Software Solutions & Digital Marketplace")
    
    # Branding Images
    site_logo = models.ImageField(upload_to="system/logo/", null=True, blank=True)
    dark_logo = models.ImageField(upload_to="system/logo/", null=True, blank=True)
    site_favicon = models.ImageField(upload_to="system/favicon/", null=True, blank=True)
    
    # Contact Info
    contact_email = models.EmailField(default="contact@newinfrizo.com")
    contact_phone = models.CharField(max_length=50, default="+8801700000000")
    support_email = models.EmailField(default="support@newinfrizo.com")
    address = models.TextField(default="Dhaka, Bangladesh")
    
    # Currency
    currency_symbol = models.CharField(max_length=10, default="$")
    currency_code = models.CharField(max_length=10, default="USD")
    
    # Accounting & Letterhead Customizations
    letterhead_header_logo = models.ImageField(upload_to="system/letterhead/", null=True, blank=True)
    letterhead_footer_text = models.TextField(default="Thank you for choosing NewInfrizo. Computer generated document.")
    company_tax_id = models.CharField(max_length=100, blank=True, help_text="TAX / VAT / Registration Number")
    bank_details = models.TextField(blank=True, help_text="Bank Account Info for Wire Transfers")
    digital_signature = models.ImageField(upload_to="system/signature/", null=True, blank=True)

    # Global SEO & Webmaster Settings
    default_meta_title = models.CharField(max_length=255, default="NewInfrizo - Premium Software & Digital Marketplace")
    default_meta_description = models.TextField(default="Leading platform for enterprise software, freelancer talent, and digital products.")
    default_meta_keywords = models.CharField(max_length=255, default="software, ecommerce, freelancers, quotes, web development")
    default_og_image = models.ImageField(upload_to="system/seo/", null=True, blank=True)
    
    # Webmaster Search Console & Analytics
    google_site_verification = models.CharField(max_length=255, blank=True, help_text="Google Search Console verification meta string")
    google_analytics_id = models.CharField(max_length=100, blank=True, help_text="GA4 Measurement ID (e.g. G-XXXXXXX)")
    google_tag_manager_id = models.CharField(max_length=100, blank=True, help_text="GTM Container ID (e.g. GTM-XXXXXXX)")
    custom_header_scripts = models.TextField(blank=True, help_text="Raw JS/HTML injected into <head>")
    custom_footer_scripts = models.TextField(blank=True, help_text="Raw JS/HTML injected before </body>")
    robots_txt_content = models.TextField(blank=True, help_text="Custom robots.txt rules")

    # Social Links
    social_facebook = models.URLField(blank=True)
    social_twitter = models.URLField(blank=True)
    social_linkedin = models.URLField(blank=True)
    social_github = models.URLField(blank=True)
    social_youtube = models.URLField(blank=True)

    class Meta:
        app_label = 'core'
        verbose_name = "Site & SEO Configuration"
        verbose_name_plural = "Site & SEO Configuration"

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        for field_name in ['site_logo', 'dark_logo', 'site_favicon', 'letterhead_header_logo', 'default_og_image', 'digital_signature']:
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

class FinancialTransaction(BaseModel):
    TRANSACTION_TYPES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    PAYMENT_METHODS = (
        ('bank', 'Bank Transfer'),
        ('card', 'Credit/Debit Card'),
        ('paypal', 'PayPal'),
        ('stripe', 'Stripe'),
        ('cash', 'Cash'),
        ('other', 'Other'),
    )
    REF_TYPES = (
        ('order', 'Order Invoice'),
        ('quote', 'Quote Proposal'),
        ('freelancer', 'Freelancer Payout'),
        ('general', 'General Ledger'),
    )

    transaction_number = models.CharField(max_length=50, unique=True, db_index=True)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES, default='income')
    category = models.CharField(max_length=100, help_text="e.g. Software Sale, Hosting Fee, Freelancer Payout")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default="USD")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='bank')
    reference_type = models.CharField(max_length=20, choices=REF_TYPES, default='general')
    reference_id = models.CharField(max_length=100, blank=True)
    transaction_date = models.DateField(db_index=True)
    notes = models.TextField(blank=True)
    attachment = models.FileField(upload_to="accounting/receipts/", null=True, blank=True)

    class Meta:
        app_label = 'core'
        ordering = ['-transaction_date', '-created_at']
        verbose_name = "Financial Transaction"
        verbose_name_plural = "Financial Accounting Ledger"

    def __str__(self):
        return f"{self.transaction_number} | {self.get_transaction_type_display()} - {self.amount} {self.currency}"