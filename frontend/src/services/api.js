import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const mockSoftwareItems = [
  {
    id: 1,
    title: 'Infrizo CRM & Accounting ERP SaaS',
    slug: 'infrizo-crm-accounting-erp-saas',
    category_name: 'Web Applications',
    version: '2.4.0',
    short_description: 'Complete multi-tenant Enterprise Resource Planning system with Django 6 & React 19 UI.',
    detailed_description: 'Full-featured SaaS platform featuring financial ledger accounting, automated quote generation, PDF invoice dispatcher, lead pipeline management, and client portal.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    live_preview_url: 'https://preview.newinfrizo.com/crm-erp',
    video_demo_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tech_stack: ['Django 6.1', 'React 19', 'PostgreSQL', 'ReportLab'],
    frameworks: 'Django, React, Tailwind CSS',
    regular_price: 89.00,
    extended_price: 399.00,
    sales_count: 342,
    rating_average: 4.95,
    is_featured: true,
    is_trending: true
  },
  {
    id: 2,
    title: 'AI Multi-Vendor E-Commerce Engine',
    slug: 'ai-multivendor-ecommerce-engine',
    category_name: 'E-Commerce Scripts',
    version: '1.8.2',
    short_description: 'Envato & Amazon style marketplace engine with instant digital downloads and Stripe payments.',
    detailed_description: 'High-performance ecommerce platform supporting digital products, physical inventory, coupon codes, tax invoices, and real-time sales reporting.',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0a67568d049f?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1556742049-0a67568d049f?auto=format&fit=crop&w=1200&q=80',
    live_preview_url: 'https://preview.newinfrizo.com/ecommerce-engine',
    tech_stack: ['Python', 'Django REST', 'React', 'Redis'],
    frameworks: 'Django, React, Vite',
    regular_price: 69.00,
    extended_price: 299.00,
    sales_count: 512,
    rating_average: 4.90,
    is_featured: true,
    is_trending: true
  },
  {
    id: 3,
    title: 'On-Demand Freelancer Marketplace Portal',
    slug: 'ondemand-freelancer-marketplace-portal',
    category_name: 'Marketplace Platforms',
    version: '3.1.0',
    short_description: 'Upwork & Fiverr style talent network platform with public applications & admin approval.',
    detailed_description: 'Complete marketplace script allowing freelancers to showcase portfolio items, set hourly rates, receive client reviews, and submit application profiles.',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    live_preview_url: 'https://preview.newinfrizo.com/freelancer-portal',
    tech_stack: ['Django', 'React', 'WebSockets', 'Tailwind'],
    frameworks: 'Django 6, React 19',
    regular_price: 99.00,
    extended_price: 499.00,
    sales_count: 289,
    rating_average: 4.88,
    is_featured: true,
    is_trending: false
  }
];

export const mockStoreProducts = [
  {
    id: 101,
    name: 'Soft UI Dashboard Pro UI Kit & React Components',
    slug: 'soft-ui-dashboard-pro-ui-kit',
    sku: 'SKU-SOFTUI-01',
    category_name: 'UI Kits',
    price: 49.00,
    sale_price: 35.00,
    is_digital: true,
    main_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    short_description: '100+ Glassmorphic React dashboard components with dark/light theme options.',
    average_rating: 4.98,
    is_featured: true
  },
  {
    id: 102,
    name: 'Enterprise Cloud Infrastructure Deployment Script',
    slug: 'enterprise-cloud-infrastructure-script',
    sku: 'SKU-CLOUD-02',
    category_name: 'DevOps Scripts',
    price: 79.00,
    sale_price: 59.00,
    is_digital: true,
    main_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    short_description: 'Automated Terraform & Ansible scripts for deploying Django + React stack on AWS & GCP.',
    average_rating: 4.92,
    is_featured: true
  },
  {
    id: 103,
    name: 'NextGen React & Native Mobile App Template',
    slug: 'nextgen-react-native-mobile-template',
    sku: 'SKU-MOBILE-03',
    category_name: 'Mobile Apps',
    price: 65.00,
    sale_price: null,
    is_digital: true,
    main_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    short_description: 'Cross-platform iOS & Android starter code with biometrics and offline sync.',
    average_rating: 4.85,
    is_featured: true
  }
];

export const mockFreelancers = [
  {
    id: 201,
    freelancer_name: 'Alexander Wright',
    title: 'Lead Fullstack Engineer & System Architect',
    hourly_rate: 65.00,
    daily_rate: 450.00,
    profile_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: '10+ years specializing in Python, Django REST, React 19, and scalable microservice architectures.',
    skills: [{ name: 'Django' }, { name: 'React 19' }, { name: 'PostgreSQL' }, { name: 'AWS' }],
    jobs_completed_count: 94,
    average_rating: 5.00,
    is_top_rated: true,
    is_featured: true
  },
  {
    id: 202,
    freelancer_name: 'Elena Rostova',
    title: 'Senior UI/UX & Glassmorphic Product Designer',
    hourly_rate: 55.00,
    daily_rate: 380.00,
    profile_photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'Crafting ultra-sleek web interfaces, mobile app design systems, and modern brand identities.',
    skills: [{ name: 'UI/UX' }, { name: 'Figma' }, { name: 'Soft UI' }, { name: 'Design Systems' }],
    jobs_completed_count: 128,
    average_rating: 4.96,
    is_top_rated: true,
    is_featured: true
  },
  {
    id: 203,
    freelancer_name: 'Devon Miller',
    title: 'DevOps Specialist & Cloud Security Engineer',
    hourly_rate: 70.00,
    daily_rate: 500.00,
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Kubernetes, CI/CD pipelines, Docker optimization, and automated server hardening.',
    skills: [{ name: 'DevOps' }, { name: 'Docker' }, { name: 'Kubernetes' }, { name: 'Security' }],
    jobs_completed_count: 76,
    average_rating: 4.93,
    is_top_rated: true,
    is_featured: false
  }
];

export const mockBlogPosts = [
  {
    id: 301,
    title: 'Architecting Enterprise SaaS Backends with Django 6 and React 19',
    slug: 'architecting-enterprise-saas-backends-django-6-react-19',
    category_name: 'Architecture',
    author_name: 'Alexander Wright',
    summary: 'Discover how to combine Django REST Framework and React 19 to build lightning-fast web applications with PDF accounting generators and automated image optimization.',
    content: 'Full walkthrough of designing robust, future-proof database models, REST APIs, image compression pipelines, and Soft UI dashboard interfaces.',
    featured_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    read_time_minutes: 8,
    published_at: '2026-08-09T10:00:00Z',
    is_published: true,
    is_featured: true
  },
  {
    id: 302,
    title: 'How WebP Image Optimization Boosts Conversion Rates by 40%',
    slug: 'webp-image-optimization-conversion-rates',
    category_name: 'Performance',
    author_name: 'Elena Rostova',
    summary: 'Learn how automated server-side image compression and WebP conversion drastically reduces page load times without sacrificing HD visual clarity.',
    content: 'Deep dive into Pillow image filters, responsive media delivery, and browser caching best practices.',
    featured_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    read_time_minutes: 5,
    published_at: '2026-08-08T14:30:00Z',
    is_published: true,
    is_featured: true
  }
];

// API Call Handlers with fallback to mock data
export const fetchSoftwareItems = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/catalog/items/`);
    return res.data.length ? res.data : mockSoftwareItems;
  } catch (err) {
    return mockSoftwareItems;
  }
};

export const fetchSoftwareItem = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/catalog/items/${id}/`);
    return res.data;
  } catch (err) {
    return mockSoftwareItems.find(item => item.id.toString() === id.toString()) || null;
  }
};

export const fetchStoreProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/store/products/`);
    return res.data.length ? res.data : mockStoreProducts;
  } catch (err) {
    return mockStoreProducts;
  }
};

export const fetchStoreProduct = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/store/products/${id}/`);
    return res.data;
  } catch (err) {
    return mockStoreProducts.find(product => product.id.toString() === id.toString()) || null;
  }
};

export const fetchFreelancers = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/marketplace/freelancers/`);
    return res.data.length ? res.data : mockFreelancers;
  } catch (err) {
    return mockFreelancers;
  }
};

export const fetchFreelancer = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/marketplace/freelancers/${id}/`);
    return res.data;
  } catch (err) {
    return mockFreelancers.find(f => f.id.toString() === id.toString()) || null;
  }
};

export const fetchBlogPosts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/blog/posts/`);
    return res.data.length ? res.data : mockBlogPosts;
  } catch (err) {
    return mockBlogPosts;
  }
};

export const fetchBlogPost = async (slug) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/blog/posts/${slug}/`);
    return res.data;
  } catch (err) {
    return mockBlogPosts.find(post => post.slug === slug || post.id.toString() === slug) || null;
  }
};

export const submitQuoteRequest = async (quoteData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/quotes/requests/`, quoteData);
    return res.data;
  } catch (err) {
    return { quote_number: 'Q-2026-MOCK', project_title: quoteData.project_title };
  }
};

export const submitFreelancerApplication = async (appData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/marketplace/applications/`, appData);
    return res.data;
  } catch (err) {
    return { full_name: appData.full_name, status: 'pending' };
  }
};
