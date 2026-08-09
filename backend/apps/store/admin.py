from django.contrib import admin, messages
from django.utils import timezone
from django.core.files.base import ContentFile
from apps.store.models import (
    ProductCategory, ProductBrand, Product, ProductGallery, ProductReview,
    Coupon, Cart, CartItem, Wishlist, Order, OrderItem
)
from apps.core.utils.pdf_generator import generate_pdf_document
from apps.core.utils.email_service import send_system_email
from apps.core.models import FinancialTransaction

class ProductGalleryInline(admin.TabularInline):
    model = ProductGallery
    extra = 1

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')

@admin.register(ProductBrand)
class ProductBrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'website')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'price', 'sale_price', 'stock_quantity', 'is_digital', 'is_featured', 'is_active')
    list_filter = ('category', 'brand', 'is_digital', 'is_featured', 'is_active')
    search_fields = ('name', 'sku', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductGalleryInline]

@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'reviewer_name', 'rating', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_approved', 'created_at')
    search_fields = ('reviewer_name', 'reviewer_email', 'comment')

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'usage_limit', 'used_count', 'is_active')
    search_fields = ('code',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'billing_name', 'billing_email', 'total_amount', 'payment_status', 'order_status', 'created_at')
    list_filter = ('payment_status', 'order_status', 'payment_method', 'created_at')
    search_fields = ('order_number', 'billing_name', 'billing_email', 'billing_phone')
    inlines = [OrderItemInline]
    actions = ['generate_pdf_invoice_and_email', 'record_financial_income']

    @admin.action(description="Generate PDF Invoice & Email Customer")
    def generate_pdf_invoice_and_email(self, request, queryset):
        sent_count = 0
        for order in queryset:
            # 1. Line items
            line_items = []
            for item in order.items.all():
                line_items.append({
                    'name': item.product_name,
                    'description': '',
                    'qty': item.quantity,
                    'unit_price': float(item.unit_price),
                    'total': float(item.total_price)
                })

            client_info = {
                'client_name': order.billing_name,
                'client_email': order.billing_email,
                'client_phone': order.billing_phone,
                'address': f"{order.billing_address}, {order.city}, {order.country}",
                'date': str(order.created_at.date()),
                'status': order.payment_status.upper()
            }

            summary = {
                'subtotal': float(order.subtotal),
                'tax_amount': float(order.tax_amount),
                'discount_amount': float(order.discount_amount),
                'grand_total': float(order.total_amount)
            }

            # 2. PDF generation
            pdf_buffer = generate_pdf_document(
                document_type="TAX INVOICE",
                document_number=order.order_number,
                client_info=client_info,
                line_items=line_items,
                summary_totals=summary,
                notes=f"Payment Method: {order.get_payment_method_display()}\nShipping Method: {order.shipping_method}"
            )

            pdf_filename = f"{order.order_number}.pdf"
            order.generated_pdf.save(pdf_filename, ContentFile(pdf_buffer.read()), save=True)

            # 3. Dispatch email
            email_context = {
                'order': order,
                'client_name': order.billing_name
            }
            send_system_email(
                subject=f"Tax Invoice for Order #{order.order_number}",
                recipient_email=order.billing_email,
                template_name="emails/order_invoice.html",
                context=email_context,
                attachment_file=order.generated_pdf.file,
                attachment_filename=pdf_filename,
                copy_to_admin=True
            )
            sent_count += 1

        self.message_user(request, f"Generated invoice PDFs & emailed customers for {sent_count} orders.", messages.SUCCESS)

    @admin.action(description="Record Income in Financial Ledger")
    def record_financial_income(self, request, queryset):
        created = 0
        for order in queryset:
            tx_num = f"TX-ORD-{order.order_number}"
            if not FinancialTransaction.objects.filter(transaction_number=tx_num).exists():
                FinancialTransaction.objects.create(
                    transaction_number=tx_num,
                    transaction_type='income',
                    category='E-Commerce Order',
                    amount=order.total_amount,
                    payment_method='card' if 'stripe' in order.payment_method else 'bank',
                    reference_type='order',
                    reference_id=order.order_number,
                    transaction_date=timezone.now().date(),
                    notes=f"Order payment for #{order.order_number}"
                )
                order.payment_status = 'paid'
                order.save()
                created += 1
        self.message_user(request, f"Recorded {created} order transaction entries.", messages.SUCCESS)