import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Search, FileText, Sparkles, Heart, Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();
  const {
    theme,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    cart,
    setIsCartOpen,
    wishlist,
    openQuoteModal,
  } = useApp();

  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)', background: 'var(--nav-bg)', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #7928CA 0%, #FF0080 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 15px rgba(203, 12, 159, 0.4)' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
              NEW<span className="gradient-text">INFRIZO</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Enterprise Platform</p>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { path: '/', label: 'All Sections' },
            { path: '/software', label: 'Software Market' },
            { path: '/store', label: 'E-Commerce Store' },
            { path: '/freelancers', label: 'Freelancers' },
            { path: '/blog', label: 'Blog' },
          ].map((tab) => {
            const isActive = location.pathname === tab.path || (tab.path !== '/' && location.pathname.startsWith(tab.path));
            return (
              <Link
                key={tab.path}
                to={tab.path}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'rgba(203, 12, 159, 0.15)' : 'transparent',
                  color: isActive ? '#cb0c9f' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Live Search Bar */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '10px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {theme === 'dark' ? <Sun size={18} color="#fde047" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Wishlist Icon */}
          <div style={{ position: 'relative', cursor: 'pointer', padding: '8px', borderRadius: '10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <Heart size={18} color={wishlist.length > 0 ? '#FF0080' : 'var(--text-secondary)'} fill={wishlist.length > 0 ? '#FF0080' : 'none'} />
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#FF0080', color: '#fff', fontSize: '0.65rem', fontWeight: 800, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {wishlist.length}
              </span>
            )}
          </div>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            <ShoppingBag size={18} color="#21D4FD" />
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span style={{ background: '#cb0c9f', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800 }}>
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Quote Button */}
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => openQuoteModal()}>
            <FileText size={16} />
            <span>Send Quote</span>
          </button>

        </div>

      </div>
    </header>
  );
};
