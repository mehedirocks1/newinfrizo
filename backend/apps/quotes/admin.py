from django.contrib import admin, messages
from django.utils import timezone
from django.core.files.base import ContentFile
from apps.quotes.models import QuoteRequest, QuoteProposal
from apps.core.utils.pdf_generator import generate_pdf_document
from apps.core.utils.email_service import send_system_email
from apps.core.models import FinancialTransaction

class QuoteProposalInline(admin.StackedInline):
    model = QuoteProposal
    extra = 0

@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ('quote_number', 'client_name', 'client_email', 'project_title', 'estimated_budget', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('quote_number', 'client_name', 'client_email', 'project_title', 'company_name')
    inlines = [QuoteProposalInline]
    actions = ['issue_proposal_and_send_email', 'create_financial_transaction']

    @admin.action(description="Generate PDF Proposal & Send Email to Client")
    def issue_proposal_and_send_email(self, request, queryset):
        sent_count = 0
        for quote in queryset:
            if hasattr(quote, 'proposal'):
                proposal = quote.proposal
                # 1. Prepare Line Items
                line_items = [
                    {
                        'name': quote.project_title,
                        'description': proposal.scope_of_work[:150] + '...',
                        'qty': 1,
                        'unit_price': float(proposal.subtotal),
                        'total': float(proposal.subtotal)
                    }
                ]
                
                client_info = {
                    'client_name': quote.client_name,
                    'client_email': quote.client_email,
                    'client_phone': quote.client_phone,
                    'company_name': quote.company_name,
                    'date': str(quote.created_at.date()),
                    'deadline_or_due': str(proposal.valid_until) if proposal.valid_until else 'N/A',
                    'status': quote.status
                }
                
                summary = {
                    'subtotal': float(proposal.subtotal),
                    'tax_amount': float(proposal.tax_amount),
                    'discount_amount': float(proposal.discount_amount),
                    'grand_total': float(proposal.proposed_cost)
                }

                # 2. Generate PDF
                pdf_buffer = generate_pdf_document(
                    document_type="QUOTATION PROPOSAL",
                    document_number=proposal.proposal_number,
                    client_info=client_info,
                    line_items=line_items,
                    summary_totals=summary,
                    notes=f"Scope: {proposal.scope_of_work}\n\nDeliverables: {proposal.deliverables}\n\nTerms: {proposal.payment_terms}"
                )

                pdf_filename = f"{proposal.proposal_number}.pdf"
                proposal.pdf_proposal.save(pdf_filename, ContentFile(pdf_buffer.read()), save=True)

                # 3. Update status to 'quoted'
                quote.status = 'quoted'
                quote.save()

                # 4. Dispatch Email
                email_context = {
                    'quote': quote,
                    'proposal': proposal,
                    'client_name': quote.client_name
                }
                send_system_email(
                    subject=f"Official Quote Proposal #{proposal.proposal_number} - {quote.project_title}",
                    recipient_email=quote.client_email,
                    template_name="emails/quote_proposal.html",
                    context=email_context,
                    attachment_file=proposal.pdf_proposal.file,
                    attachment_filename=pdf_filename,
                    copy_to_admin=True
                )
                sent_count += 1

        self.message_user(request, f"Issued proposal PDF & sent emails for {sent_count} quotation requests.", messages.SUCCESS)

    @admin.action(description="Record Income in Financial Ledger")
    def create_financial_transaction(self, request, queryset):
        created = 0
        for quote in queryset:
            if hasattr(quote, 'proposal'):
                proposal = quote.proposal
                tx_num = f"TX-Q-{quote.quote_number}"
                if not FinancialTransaction.objects.filter(transaction_number=tx_num).exists():
                    FinancialTransaction.objects.create(
                        transaction_number=tx_num,
                        transaction_type='income',
                        category='Software Quotation',
                        amount=proposal.proposed_cost,
                        payment_method='bank',
                        reference_type='quote',
                        reference_id=quote.quote_number,
                        transaction_date=timezone.now().date(),
                        notes=f"Quotation payment for {quote.project_title}"
                    )
                    quote.status = 'invoice_generated'
                    quote.save()
                    created += 1
        self.message_user(request, f"Recorded {created} financial ledger entries.", messages.SUCCESS)

@admin.register(QuoteProposal)
class QuoteProposalAdmin(admin.ModelAdmin):
    list_display = ('proposal_number', 'quote_request', 'proposed_cost', 'estimated_delivery_days', 'is_approved_by_client', 'created_at')
    search_fields = ('proposal_number', 'quote_request__quote_number', 'quote_request__client_name')
    list_filter = ('is_approved_by_client', 'created_at')