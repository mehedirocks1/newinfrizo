import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShoppingBag, Download, Star, ShieldCheck, Plus, Minus, Tag, Check } from 'lucide-react';

export const ProductDetailModal = () => {
  const { selectedProductDetail, setSelectedProductDetail, addToCart, setIsCartOpen, showToast } = useApp();
  const [qty, setQty] = useState(1);

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const effectivePrice = product.sale_price || product.price;

  const handleInstantBuy = () => {
    addToCart({ ...product, quantity: qty });
    setSelectedProductDetail(null);
    setIsCartOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedProductDetail(null)}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>
              {product.category_name}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {product.sku}</span>
          </div>
          <button onClick={() => setSelectedProductDetail(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Product Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px' }}>
          
          {/* Left: Product Image */}
          <div>
            <img
              src={product.main_image}
              alt={product.name}
              style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--border-color)' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
              <span className="badge badge-blue"><Download size={12} /> Digital Download</span>
              <span className="badge badge-green"><Check size={12} /> In Stock</span>
            </div>
          </div>

          {/* Right: Info & Purchase Controls */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
              {product.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700, marginBottom: '16px' }}>
              <Star size={16} fill="#f59e0b" />
              <span>{product.average_rating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Verified Purchase Reviews)</span>
            </div>

            {/* Pricing Breakdown */}
            <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
              {product.sale_price ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>${product.sale_price}</span>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${product.price}</span>
                  <span className="badge badge-green">Save ${(product.price - product.sale_price).toFixed(2)}</span>
                </div>
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>${product.price}</span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px', flex: 1 }}>
              {product.description || product.short_description}
            </p>

            {/* Quantity Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '10px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  addToCart({ ...product, quantity: qty });
                  setSelectedProductDetail(null);
                }}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #21D4FD 0%, #2176FF 100%)' }}
                onClick={handleInstantBuy}
              >
                <span>Direct Checkout</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'center', marginTop: '16px' }}>
              <ShieldCheck size={14} color="#0284c7" />
              <span>Instant Download Link & PDF Tax Invoice Dispatched Post Checkout</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
