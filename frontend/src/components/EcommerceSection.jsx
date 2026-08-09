import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchStoreProducts } from '../services/api';
import { ShoppingBag, Heart, Star, Download, Eye } from 'lucide-react';
import { Pagination } from './Pagination';

export const EcommerceSection = () => {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist, searchQuery } = useApp();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  useEffect(() => {
    fetchStoreProducts().then((data) => setProducts(data));
  }, []);

  const categories = ['All', 'UI Kits', 'DevOps Scripts', 'Mobile Apps'];

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category_name === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  return (
    <section id="store" style={{ padding: '60px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-blue" style={{ marginBottom: '10px' }}>
            <span>Section 2 • Professional E-Commerce Platform</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Digital Products & <span className="gradient-text-blue">Store Inventory</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Instant digital downloads, UI component kits, and development tools with automated tax PDF invoices.
          </p>
        </div>

        {/* Category Pills Filter */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--input-bg)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeCategory === cat ? 'linear-gradient(135deg, #21D4FD 0%, #2176FF 100%)' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'var(--text-secondary)',
                fontWeight: activeCategory === cat ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {paginatedProducts.map((product) => {
          const isWishlisted = wishlist.some((w) => w.id === product.id);

          return (
            <div key={product.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* Product Image Header */}
              <div
                style={{ position: 'relative', height: '220px', overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/store/${product.id}`)}
              >
                <img
                  src={product.main_image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Badges */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  {product.is_digital && <span className="badge badge-blue"><Download size={10} /> Instant Download</span>}
                  {product.sale_price && <span className="badge badge-green">Sale</span>}
                </div>

                {/* Wishlist Icon Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Heart size={18} color={isWishlisted ? '#FF0080' : '#fff'} fill={isWishlisted ? '#FF0080' : 'none'} />
                </button>
              </div>

              {/* Product Content */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>
                    {product.category_name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Star size={14} fill="#f59e0b" />
                    <span>{product.average_rating}</span>
                  </div>
                </div>

                <h3
                  onClick={() => navigate(`/store/${product.id}`)}
                  style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  {product.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1 }}>
                  {product.short_description}
                </p>

                {/* Pricing & Add to Cart */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    {product.sale_price ? (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>${product.sale_price}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${product.price}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>${product.price}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => navigate(`/store/${product.id}`)}>
                      <Eye size={14} />
                      <span>View Order</span>
                    </button>

                    <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem', background: 'linear-gradient(135deg, #21D4FD 0%, #2176FF 100%)' }} onClick={() => addToCart(product)}>
                      <ShoppingBag size={16} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

    </section>
  );
};
