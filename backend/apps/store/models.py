import uuid
from django.db import models
from django.contrib.auth.models import User
from apps.core.models import BaseModel
from apps.core.utils.image_optimizer import compress_and_convert_to_webp

class ProductCategory(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    icon = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'store'
        verbose_name_plural = "Product Categories"

    def __str__(self):
        return self.name

class ProductBrand(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to="brands/", null=True, blank=True)
    website = models.URLField(blank=True)

    class Meta:
        app_label = 'store'

    def __str__(self):
        return self.name

class Product(BaseModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, db_index=True)
    sku = models.CharField(max_length=50, unique=True, db_index=True)
    
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE, related_name='products')
    brand = models.ForeignKey(ProductBrand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    
    short_description = models.CharField(max_length=500, blank=True)
    description = models.TextField()
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=10)
    
    is_digital = models.BooleanField(default=False)
    digital_file = models.FileField(upload_to="products/digital/", null=True, blank=True)
    
    main_image = models.ImageField(upload_to="products/main/")
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    views_count = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)

    class Meta:
        app_label = 'store'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.sku})"

    def get_effective_price(self):
        return self.sale_price if self.sale_price and self.sale_price > 0 else self.price

    def save(self, *args, **kwargs):
        if self.main_image and not self.main_image.name.endswith('.webp'):
            try:
                _ = self.main_image.file
                optimized = compress_and_convert_to_webp(self.main_image)
                if optimized:
                    self.main_image = optimized
            except Exception:
                pass
        super().save(*args, **kwargs)

class ProductGallery(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to="products/gallery/")
    alt_text = models.CharField(max_length=255, blank=True)

    class Meta:
        app_label = 'store'

    def __str__(self):
        return f"Gallery image for {self.product.name}"

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

class ProductReview(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    reviewer_name = models.CharField(max_length=255)
    reviewer_email = models.EmailField()
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField()
    is_approved = models.BooleanField(default=True)

    class Meta:
        app_label = 'store'
        ordering = ['-created_at']

class Coupon(BaseModel):
    DISCOUNT_TYPES = (
        ('percentage', 'Percentage (%)'),
        ('fixed', 'Fixed Amount ($)'),
    )
    code = models.CharField(max_length=50, unique=True, db_index=True)
    discount_type = models.CharField(max_length=15, choices=DISCOUNT_TYPES, default='percentage')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    usage_limit = models.PositiveIntegerField(default=100)
    used_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'store'

    def __str__(self):
        return self.code

class Cart(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='carts')
    session_key = models.CharField(max_length=255, blank=True, db_index=True)

    class Meta:
        app_label = 'store'

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        app_label = 'store'

    def get_total(self):
        return self.quantity * self.product.get_effective_price()

class Wishlist(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField(Product, blank=True)

    class Meta:
        app_label = 'store'

class Order(BaseModel):
    PAYMENT_STATUS = (
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    )
    ORDER_STATUS = (
        ('pending', 'Pending Review'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    PAYMENT_METHODS = (
        ('stripe', 'Stripe Card'),
        ('paypal', 'PayPal'),
        ('bank_transfer', 'Bank Transfer'),
        ('cash_on_delivery', 'Cash on Delivery'),
    )

    order_number = models.CharField(max_length=50, unique=True, db_index=True, editable=False)
    client = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    
    billing_name = models.CharField(max_length=255)
    billing_email = models.EmailField()
    billing_phone = models.CharField(max_length=50)
    billing_address = models.TextField()
    city = models.CharField(max_length=100, default="Dhaka")
    zip_code = models.CharField(max_length=20, default="1200")
    country = models.CharField(max_length=100, default="Bangladesh")
    
    shipping_name = models.CharField(max_length=255, blank=True)
    shipping_address = models.TextField(blank=True)
    shipping_method = models.CharField(max_length=100, default="Standard Delivery")
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='bank_transfer')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='unpaid', db_index=True)
    order_status = models.CharField(max_length=20, choices=ORDER_STATUS, default='pending', db_index=True)
    
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    admin_notes = models.TextField(blank=True)
    generated_pdf = models.FileField(upload_to="invoices/pdf/", null=True, blank=True)

    class Meta:
        app_label = 'store'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_number} ({self.get_order_status_display()})"

    def save(self, *args, **kwargs):
        if not self.order_number:
            short_id = uuid.uuid4().hex[:6].upper()
            self.order_number = f"ORD-2026-{short_id}"
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        app_label = 'store'

    def __str__(self):
        return f"{self.quantity}x {self.product_name} in {self.order.order_number}"