import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchSoftwareItem } from '../services/api';
import { Play, ExternalLink, FileText, CheckCircle2, Star, Shield, Cpu, Layers, ArrowLeft } from 'lucide-react';

export const SoftwareDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openQuoteModal, setVideoModalUrl } = useApp();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLicense, setSelectedLicense] = useState('regular');

  useEffect(() => {
    fetchSoftwareItem(id).then(data => {
      setItem(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', minHeight: '80vh' }}>Loading...</div>;
  if (!item) return <div style={{ padding: '60px', textAlign: 'center', minHeight: '80vh' }}>Software not found</div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/software')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '20px', fontWeight: 600 }}
      >
        <ArrowLeft size={18} />
        Back to Software Market
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-purple">v{item.version}</span>
          <span style={{ fontSize: '0.85rem', color: '#cb0c9f', fontWeight: 700, textTransform: 'uppercase' }}>
            {item.category_name}
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ position: 'relative', height: '360px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
        <img src={item.banner || item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%)', display: 'flex', alignItems: 'flex-end', padding: '32px' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>{item.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#f59e0b', fontSize: '1rem', fontWeight: 700 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={18} fill="#f59e0b" />
                <span>{item.rating_average} Rating</span>
              </div>
              <span style={{ color: '#d1d5db', fontWeight: 400 }}>•</span>
              <span style={{ color: '#d1d5db' }}>{item.sales_count} Verified Sales</span>
            </div>
          </div>
        </div>

        {item.video_demo_url && (
          <button
            onClick={() => setVideoModalUrl(item.video_demo_url)}
            style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '10px 20px', borderRadius: '24px', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
          >
            <Play size={18} color="#cb0c9f" fill="#cb0c9f" />
            <span>Watch Video Demo</span>
          </button>
        )}
      </div>

      {/* Content Body & License Sidebar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        
        {/* Left Column: Description & Specifications */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Software Overview
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
            {item.detailed_description || item.short_description}
          </p>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="#cb0c9f" />
            <span>Tech Stack & Frameworks</span>
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
            {item.tech_stack?.map((tech, idx) => (
              <span key={idx} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem', padding: '6px 14px', borderRadius: '8px', fontWeight: 600 }}>
                {tech}
              </span>
            ))}
          </div>

          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#21D4FD" />
            <span>Key Features Included</span>
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#82d616" />
              <span>Full Source Code Included</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#82d616" />
              <span>Automated Features Included</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#82d616" />
              <span>Lifetime Updates & Commercial License</span>
            </li>
          </ul>
        </div>

        {/* Right Column: License Selection & Quote Order */}
        <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Select License Type</h4>
          
          {/* Regular License Option */}
          <div
            onClick={() => setSelectedLicense('regular')}
            style={{
              border: selectedLicense === 'regular' ? '2px solid #cb0c9f' : '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '16px',
              cursor: 'pointer',
              background: selectedLicense === 'regular' ? 'rgba(203, 12, 159, 0.1)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Regular License</span>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#cb0c9f' }}>${item.regular_price}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Use in a single end product (End users not charged)</p>
          </div>

          {/* Extended License Option */}
          <div
            onClick={() => setSelectedLicense('extended')}
            style={{
              border: selectedLicense === 'extended' ? '2px solid #21D4FD' : '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '16px',
              cursor: 'pointer',
              background: selectedLicense === 'extended' ? 'rgba(33, 212, 253, 0.1)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Extended License</span>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', color: '#21D4FD' }}>${item.extended_price}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Use in an end product where end users can be charged (SaaS)</p>
          </div>

          {/* Actions */}
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
            onClick={() => openQuoteModal(item)}
          >
            <FileText size={18} />
            <span>Send Custom Quote</span>
          </button>

          {item.live_preview_url && (
            <a
              href={item.live_preview_url}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}
            >
              <ExternalLink size={18} />
              <span>Live Preview Link</span>
            </a>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', justifyContent: 'center', marginTop: '8px' }}>
            <Shield size={16} color="#82d616" />
            <span>Includes 6 Months Developer Support</span>
          </div>

        </div>

      </div>
    </div>
  );
};
