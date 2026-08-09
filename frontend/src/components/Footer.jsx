import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Globe, Share2, Code, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: 'var(--footer-bg)', borderTop: '1px solid var(--border-color)', padding: '60px 24px 30px', marginTop: '60px', color: 'var(--text-primary)', transition: 'background-color 0.3s ease' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7928CA 0%, #FF0080 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <Sparkles size={18} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>NEW<span className="gradient-text">INFRIZO</span></h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              Next-generation software selling marketplace, e-commerce digital store platform, top freelancer network, & enterprise accounting backend.
            </p>
            <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
              <Globe size={18} style={{ cursor: 'pointer' }} />
              <Share2 size={18} style={{ cursor: 'pointer' }} />
              <Code size={18} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/software" style={{ color: 'inherit', textDecoration: 'none' }}>Software Selling Marketplace</Link></li>
              <li><Link to="/store" style={{ color: 'inherit', textDecoration: 'none' }}>E-Commerce Store & UI Kits</Link></li>
              <li><Link to="/freelancers" style={{ color: 'inherit', textDecoration: 'none' }}>Freelancer Talent Directory</Link></li>
              <li><Link to="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Engineering Blog & News</Link></li>
            </ul>
          </div>

          {/* Enterprise Accounting */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Accounting & PDF Tools</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><span>Automated PDF Quote Proposals</span></li>
              <li><span>Tax Invoice Generation</span></li>
              <li><span>WebP HD Image Optimization</span></li>
              <li><span>Django 6 REST API Integration</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subscribe to Updates</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Get weekly releases of software templates & developer tools.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="developer@company.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
              />
              <button className="btn-primary" style={{ padding: '10px 14px' }}>
                <Mail size={16} />
              </button>
            </div>
          </div>

        </div>

        {/* Copyright Footer */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <p>&copy; 2026 NewInfrizo Engine. Built with Django 6.1, Soft UI & React 19.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
            <ShieldCheck size={16} />
            <span>Encrypted SSL & Automated PDF Accounting Ledger Active</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
