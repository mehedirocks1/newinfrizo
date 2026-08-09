import uuid
from django.db import models
from django.contrib.auth.models import User
from apps.core.models import BaseModel
from apps.catalog.models import SoftwareItem

class QuoteRequest(BaseModel):
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('under_review', 'Under Review'),
        ('quoted', 'Quote Issued'),
        ('accepted', 'Accepted by Client'),
        ('rejected', 'Rejected by Client'),
        ('invoice_generated', 'Invoice Generated'),
        ('cancelled', 'Cancelled'),
    )

    quote_number = models.CharField(max_length=50, unique=True, db_index=True, editable=False)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quote_requests', null=True, blank=True)
    client_name = models.CharField(max_length=255)
    client_email = models.EmailField()
    client_phone = models.CharField(max_length=50)
    company_name = models.CharField(max_length=255, blank=True)
    
    software_item = models.ForeignKey(SoftwareItem, on_delete=models.SET_NULL, null=True, blank=True, help_text="Optional reference software product")
    project_title = models.CharField(max_length=255)
    project_overview = models.TextField(blank=True)
    detailed_requirements = models.TextField()
    additional_features = models.JSONField(default=list, blank=True, help_text="Custom selected add-on modules")
    requirements_doc = models.FileField(upload_to="quotes/docs/", null=True, blank=True)
    
    estimated_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    expected_deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending', db_index=True)

    class Meta:
        app_label = 'quotes'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.quote_number} - {self.project_title} ({self.get_status_display()})"

    def save(self, *args, **kwargs):
        if not self.quote_number:
            # Generate sequential quote number
            short_id = uuid.uuid4().hex[:6].upper()
            self.quote_number = f"Q-2026-{short_id}"
        super().save(*args, **kwargs)

class QuoteProposal(BaseModel):
    quote_request = models.OneToOneField(QuoteRequest, on_delete=models.CASCADE, related_name='proposal')
    proposal_number = models.CharField(max_length=50, unique=True, db_index=True, editable=False)
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    proposed_cost = models.DecimalField(max_digits=12, decimal_places=2, help_text="Grand Total proposed cost")
    
    estimated_delivery_days = models.PositiveIntegerField(default=14)
    valid_until = models.DateField(null=True, blank=True)
    
    scope_of_work = models.TextField()
    deliverables = models.TextField(blank=True)
    payment_terms = models.TextField(blank=True, default="50% upfront deposit, 50% upon final delivery.")
    terms_and_conditions = models.TextField(blank=True)
    
    is_approved_by_client = models.BooleanField(default=False)
    client_accepted_at = models.DateTimeField(null=True, blank=True)
    pdf_proposal = models.FileField(upload_to="proposals/pdf/", null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        app_label = 'quotes'
        ordering = ['-created_at']

    def __str__(self):
        return f"Proposal {self.proposal_number} for {self.quote_request.quote_number}"

    def save(self, *args, **kwargs):
        if not self.proposal_number:
            short_id = uuid.uuid4().hex[:6].upper()
            self.proposal_number = f"PROP-{short_id}"
        super().save(*args, **kwargs)