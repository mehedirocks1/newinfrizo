import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle2 } from 'lucide-react';

export const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, updateCartQty, cartTotal, showToast } = useApp();
  const [checkedOut, setCheckedOut] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setCheckedOut(true);
    showToast(`Order Checkout Completed! Tax Invoice PDF Generated.`);
  };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }} onClick={() => setIsCartOpen(false)}>
      <div
        style={{
          width: '100%',
          maxWidth: '450px',
          height: '100vh',
          background: '#111827',
          borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#21D4FD" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Shopping Cart</h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {checkedOut ? (
          <div style={{ textAlignment: 'center', margin: 'auto 0', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(33, 212, 253, 0.15)', color: '#21D4FD', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Order Placed!</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '20px' }}>
              Your order has been logged and your official PDF Tax Invoice has been generated and dispatched to your email.
            </p>
            <button className="btn-primary" onClick={() => { setCheckedOut(false); setIsCartOpen(false); }}>
              Back to Store
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div style={{ margin: 'auto 0', textAlign: 'center', color: '#6b7280' }}>
            <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>Your cart is empty</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Explore products and software to add items</p>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
              {cart.map((item) => {
                const itemPrice = item.sale_price || item.price || item.regular_price || 0;
                return (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px' }}>
                    <img
                      src={item.main_image || item.thumbnail}
                      alt={item.name || item.title}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{item.name || item.title}</h4>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#21D4FD' }}>${itemPrice}</span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <button onClick={() => updateCartQty(item.id, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '22px', height: '22px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '22px', height: '22px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', alignSelf: 'flex-start' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Total Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: '#9ca3af' }}>
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                <span>Total Amount:</span>
                <span style={{ color: '#a3e635' }}>${cartTotal.toFixed(2)}</span>
              </div>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', background: 'linear-gradient(135deg, #21D4FD 0%, #2176FF 100%)' }} onClick={handleCheckout}>
                <span>Proceed to Checkout & PDF Invoice</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
