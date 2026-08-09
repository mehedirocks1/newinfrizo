import React from 'react';
import { useApp } from '../context/AppContext';
import { Rocket, ShieldCheck, Code, ShoppingCart, UserCheck, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const { openQuoteModal, setFreelancerModalOpen } = useApp();

  return (
    <section style={{ position: 'relative', padding: '80px 24px 60px', overflow: 'hidden', textAlign: 'center' }}>
      
      {/* Glow Orbs background */}
      <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(203,12,159,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        
        {/* Top Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: 'rgba(203, 12, 159, 0.1)', border: '1px solid rgba(203, 12, 159, 0.25)', color: '#cb0c9f', fontSize: '0.85rem', fontWeight: 700, marginBottom: '24px' }}>
          <Rocket size={16} />
          <span>Django 6.1 & React 19 Soft UI Engine</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: '20px', color: 'var(--text-primary)' }}>
          Enterprise <span className="gradient-text">Software Marketplace</span>, E-Commerce & <span className="gradient-text-blue">Talent Network</span>
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 36px', fontWeight: 400 }}>
          Discover ready-to-deploy web applications, shop digital assets, hire vetted top-rated freelancers, or request a custom PDF quote with itemized accounting.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={() => openQuoteModal()}>
            <span>Request Custom Quote</span>
            <ArrowRight size={18} />
          </button>
          
          <button className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={() => setFreelancerModalOpen(true)}>
            <UserCheck size={18} color="#82d616" />
            <span>Apply as Freelancer</span>
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: Code, title: '100+ Software Items', desc: 'Envato style web & SaaS scripts', color: '#cb0c9f' },
            { icon: ShoppingCart, title: '500+ Digital Products', desc: 'UI Kits, Apps & Dev Tools', color: '#21D4FD' },
            { icon: UserCheck, title: 'Top 1% Freelancers', desc: 'Vetted engineers & designers', color: '#82d616' },
            { icon: ShieldCheck, title: 'Instant PDF Invoices', desc: 'Itemized accounting ledger', color: '#f59e0b' },
          ].map((stat, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '20px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${stat.color}15`, border: `1px solid ${stat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
                <stat.icon size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
