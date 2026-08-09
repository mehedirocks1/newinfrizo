import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchStoreProduct } from '../services/api';
import { ShoppingCart, Heart, ShieldCheck, ArrowLeft, Star, Minus, Plus } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useApp();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchStoreProduct(id).then(data => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', minHeight: '80vh' }}>Loading...</div>;
  if (!product) return <div style={{ padding: '60px', textAlign: 'center', minHeight: '80vh' }}>Product not found</div>;

  const currentPrice = product.sale_price || product.price;
  const isWishlisted = wishlist.some(p => p.id === product.id);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1100px', margin: '0 auto', minHeight: '80vh' }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/store')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '30px', fontWeight: 600 }}
      >
        <ArrowLeft size={18} />
        Back to E-Commerce Store
      </button>

      {/* Product Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px' }}>
        
        {/* Left: Image Gallery */}
        <div>
          <div style={{ width: '100%', height: '400px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '16px', background: 'var(--bg-card)' }}>
            <img src={product.main_image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {/* Mock secondary images could go here */}
        </div>

        {/* Right: Product Details & Cart Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>
              {product.category_name}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>SKU: {product.sku}</span>
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {product.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontSize: '0.95rem', fontWeight: 700, marginBottom: '20px' }}>
            <Star size={18} fill="#f59e0b" />
            <span>{product.average_rating} Rating</span>
          </div>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {product.short_description}
          </p>

          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            {product.sale_price && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 600 }}>
                ${product.price}
              </span>
            )}
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              ${currentPrice}
            </span>
            {product.sale_price && (
              <span className="badge badge-green" style={{ marginBottom: '6px' }}>
                Save ${ (product.price - product.sale_price).toFixed(2) }
              </span>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--input-bg)' }}>
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                style={{ padding: '12px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <Minus size={18} />
              </button>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', width: '30px', textAlign: 'center' }}>
                {qty}
              </span>
              <button 
                onClick={() => setQty(qty + 1)}
                style={{ padding: '12px 16px', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                <Plus size={18} />
              </button>
            </div>

            <button 
              className="btn-primary" 
              style={{ flex: 1, justifyContent: 'center', fontSize: '1.05rem', padding: '14px' }}
              onClick={() => addToCart({ ...product, quantity: qty })}
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            
            <button 
              onClick={() => toggleWishlist(product)}
              style={{ 
                padding: '14px', 
                borderRadius: '12px', 
                border: '1px solid var(--border-color)', 
                background: isWishlisted ? 'rgba(239, 68, 68, 0.1)' : 'var(--input-bg)', 
                color: isWishlisted ? '#ef4444' : 'var(--text-secondary)', 
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Heart size={22} fill={isWishlisted ? '#ef4444' : 'transparent'} />
            </button>
          </div>

          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(22, 163, 74, 0.05)', border: '1px solid rgba(22, 163, 74, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={24} color="#16a34a" />
            <div>
              <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Secure Checkout</span>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>SSL Encrypted Payment Gateway</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
