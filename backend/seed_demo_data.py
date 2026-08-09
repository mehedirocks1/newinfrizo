import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newinfrizo.settings')
django.setup()

from decimal import Decimal
from django.utils import timezone
from django.contrib.auth.models import User

from apps.catalog.models import SoftwareCategory, SoftwareItem, SoftwareGalleryImage, SoftwareChangelog, SoftwareFeature
from apps.store.models import ProductCategory, ProductBrand, Product, ProductGallery, Coupon
from apps.marketplace.models import Skill, FreelancerProfile, FreelancerPortfolioItem, FreelancerReview

print("Seeding backend database with real demo data...")

# 1. SOFTWARE CATALOG DEMO DATA
cat_web, _ = SoftwareCategory.objects.get_or_create(
    slug="web-applications",
    defaults={"name": "Web Applications", "icon": "ri-code-s-slash-line", "description": "Full-stack web applications and SaaS starters"}
)
cat_ecommerce, _ = SoftwareCategory.objects.get_or_create(
    slug="ecommerce-scripts",
    defaults={"name": "E-Commerce Scripts", "icon": "ri-shopping-bag-3-line", "description": "Multi-vendor marketplace and store engines"}
)

soft1, _ = SoftwareItem.objects.get_or_create(
    slug="infrizo-crm-accounting-erp-saas",
    defaults={
        "title": "Infrizo CRM & Accounting ERP SaaS",
        "category": cat_web,
        "version": "2.4.0",
        "short_description": "Complete multi-tenant Enterprise Resource Planning system with Django 6 & React 19 UI.",
        "detailed_description": "Full-featured SaaS platform featuring financial ledger accounting, automated quote generation, PDF invoice dispatcher, lead pipeline management, and client portal.",
        "thumbnail": "software/thumbnails/crm_erp.webp",
        "banner": "software/banners/crm_erp_banner.webp",
        "live_preview_url": "https://preview.newinfrizo.com/crm-erp",
        "video_demo_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "tech_stack": ["Django 6.1", "React 19", "PostgreSQL", "ReportLab", "Redis"],
        "frameworks": "Django 6.1, React 19, Vite",
        "compatible_browsers": "Chrome, Firefox, Safari, Edge",
        "regular_price": Decimal("89.00"),
        "extended_price": Decimal("399.00"),
        "sales_count": 342,
        "rating_average": Decimal("4.95"),
        "is_featured": True,
        "is_trending": True,
        "is_active": True
    }
)

SoftwareFeature.objects.get_or_create(software=soft1, title="Automated PDF Quote Generator", description="ReportLab invoice & quote rendering on company letterhead.")
SoftwareFeature.objects.get_or_create(software=soft1, title="Financial Accounting Ledger", description="Income and expense ledger tracking with receipt attachments.")
SoftwareFeature.objects.get_or_create(software=soft1, title="Automatic WebP Media Compression", description="Server-side Pillow image optimizer reducing image sizes by 70%.")

SoftwareChangelog.objects.get_or_create(software=soft1, version="2.4.0", release_date=timezone.now().date(), change_notes="Upgraded to Django 6.1, added Soft UI dashboard theme & WebP signal hooks.")

soft2, _ = SoftwareItem.objects.get_or_create(
    slug="ai-multivendor-ecommerce-engine",
    defaults={
        "title": "AI Multi-Vendor E-Commerce Engine",
        "category": cat_ecommerce,
        "version": "1.8.2",
        "short_description": "Envato & Amazon style marketplace engine with instant digital downloads and Stripe payments.",
        "detailed_description": "High-performance ecommerce platform supporting digital products, physical inventory, coupon codes, tax invoices, and real-time sales reporting.",
        "thumbnail": "software/thumbnails/ecommerce_engine.webp",
        "live_preview_url": "https://preview.newinfrizo.com/ecommerce-engine",
        "tech_stack": ["Python", "Django REST", "React 19", "Stripe API"],
        "frameworks": "Django 6.1, React 19",
        "compatible_browsers": "Chrome, Firefox, Safari, Edge",
        "regular_price": Decimal("69.00"),
        "extended_price": Decimal("299.00"),
        "sales_count": 512,
        "rating_average": Decimal("4.90"),
        "is_featured": True,
        "is_trending": True,
        "is_active": True
    }
)

# 2. STORE PRODUCTS & BRANDS
store_cat_uikits, _ = ProductCategory.objects.get_or_create(
    slug="ui-kits",
    defaults={"name": "UI Kits & Templates", "description": "Glassmorphic React & Tailwind UI component libraries"}
)
store_cat_devops, _ = ProductCategory.objects.get_or_create(
    slug="devops-scripts",
    defaults={"name": "DevOps & Cloud Scripts", "description": "Terraform, Ansible, and Docker automation scripts"}
)
store_cat_mobile, _ = ProductCategory.objects.get_or_create(
    slug="mobile-templates",
    defaults={"name": "Mobile App Templates", "description": "React Native starter code and UI components"}
)

brand_infrizo, _ = ProductBrand.objects.get_or_create(slug="newinfrizo-labs", defaults={"name": "NewInfrizo Labs", "website": "https://newinfrizo.com"})

Product.objects.get_or_create(
    sku="SKU-SOFTUI-01",
    defaults={
        "name": "Soft UI Dashboard Pro UI Kit & React Components",
        "slug": "soft-ui-dashboard-pro-ui-kit",
        "category": store_cat_uikits,
        "brand": brand_infrizo,
        "short_description": "100+ Glassmorphic React dashboard components with dark/light theme options.",
        "description": "Premium React 19 UI component library featuring soft shadow cards, customizable CSS variables, chart widgets, data tables, and modal components.",
        "price": Decimal("49.00"),
        "sale_price": Decimal("35.00"),
        "stock_quantity": 999,
        "is_digital": True,
        "main_image": "products/main/soft_ui_kit.webp",
        "is_featured": True,
        "is_active": True,
        "average_rating": Decimal("4.98")
    }
)

Product.objects.get_or_create(
    sku="SKU-CLOUD-02",
    defaults={
        "name": "Enterprise Cloud Infrastructure Deployment Script",
        "slug": "enterprise-cloud-infrastructure-script",
        "category": store_cat_devops,
        "brand": brand_infrizo,
        "short_description": "Automated Terraform & Ansible scripts for deploying Django + React stack on AWS & GCP.",
        "description": "Production-ready DevOps automation suite. Deploys PostgreSQL, Redis, Nginx reverse proxy, SSL certs, and Celery workers with 1 command.",
        "price": Decimal("79.00"),
        "sale_price": Decimal("59.00"),
        "stock_quantity": 999,
        "is_digital": True,
        "main_image": "products/main/cloud_devops.webp",
        "is_featured": True,
        "is_active": True,
        "average_rating": Decimal("4.92")
    }
)

Coupon.objects.get_or_create(
    code="WELCOME20",
    defaults={
        "discount_type": "percentage",
        "discount_value": Decimal("20.00"),
        "valid_from": timezone.now(),
        "valid_to": timezone.now() + timezone.timedelta(days=365),
        "is_active": True
    }
)

# 3. FREELANCER MARKETPLACE DEMO DATA
skill_django, _ = Skill.objects.get_or_create(slug="django", defaults={"name": "Django 6.1", "category": "Backend"})
skill_react, _ = Skill.objects.get_or_create(slug="react-19", defaults={"name": "React 19", "category": "Frontend"})
skill_postgres, _ = Skill.objects.get_or_create(slug="postgresql", defaults={"name": "PostgreSQL", "category": "Database"})
skill_ui, _ = Skill.objects.get_or_create(slug="ui-ux-design", defaults={"name": "UI/UX Design", "category": "Design"})

user_alex, _ = User.objects.get_or_create(username="alex_wright", defaults={"email": "alex@newinfrizo.com", "first_name": "Alexander", "last_name": "Wright"})
user_alex.set_password("freelancerpass123")
user_alex.save()

profile_alex, _ = FreelancerProfile.objects.get_or_create(
    user=user_alex,
    defaults={
        "title": "Lead Fullstack Engineer & System Architect",
        "bio": "10+ years specializing in Python, Django REST Framework, React 19, and scalable microservice architectures.",
        "hourly_rate": Decimal("65.00"),
        "daily_rate": Decimal("450.00"),
        "portfolio_url": "https://alexwright.dev",
        "jobs_completed_count": 94,
        "average_rating": Decimal("5.00"),
        "ranking_score": 500,
        "is_top_rated": True,
        "is_featured": True,
        "is_approved": True
    }
)
profile_alex.skills.add(skill_django, skill_react, skill_postgres)

user_elena, _ = User.objects.get_or_create(username="elena_rostova", defaults={"email": "elena@newinfrizo.com", "first_name": "Elena", "last_name": "Rostova"})
user_elena.set_password("freelancerpass123")
user_elena.save()

profile_elena, _ = FreelancerProfile.objects.get_or_create(
    user=user_elena,
    defaults={
        "title": "Senior UI/UX & Glassmorphic Product Designer",
        "bio": "Crafting ultra-sleek web interfaces, mobile app design systems, and modern Soft UI brand identities.",
        "hourly_rate": Decimal("55.00"),
        "daily_rate": Decimal("380.00"),
        "portfolio_url": "https://elenarostova.design",
        "jobs_completed_count": 128,
        "average_rating": Decimal("4.96"),
        "ranking_score": 480,
        "is_top_rated": True,
        "is_featured": True,
        "is_approved": True
    }
)
profile_elena.skills.add(skill_ui, skill_react)

print("Demo data seeded successfully! (Skipped blog posts as requested)")
