import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, ExternalLink, FileText, CheckCircle2, Star, Shield, Cpu, Layers } from 'lucide-react';

export const SoftwareDetailModal = () => {
  const { selectedSoftwareDetail, setSelectedSoftwareDetail, openQuoteModal, setVideoModalUrl } = useApp();
  const [selectedLicense, setSelectedLicense] = useState('regular');

  if (!selectedSoftwareDetail) return null;

  const item = selectedSoftwareDetail;
  const currentPrice = selectedLicense === 'regular' ? item.regular_price : item.extended_price;

  return (
    <div className="modal-overlay" onClick={() => setSelectedSoftwareDetail(null)}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-purple">v{item.version}</span>
            <span style={{ fontSize: '0.85rem', color: '#cb0c9f', fontWeight: 700, textTransform: 'uppercase' }}>
              {item.category_name}
            </span>
          </div>
          <button onClick={() => setSelectedSoftwareDetail(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Hero Section */}
        <div style={{ position: 'relative', height: '280px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
          <img src={item.banner || item.thumbnail} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%)', display: 'flex', alignItems: 'flex-end', padding: '24px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>{item.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} fill="#f59e0b" />
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
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
            >
              <Play size={16} color="#cb0c9f" fill="#cb0c9f" />
              <span>Watch Video Demo</span>
            </button>
          )}
        </div>

        {/* Content Body & License Sidebar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          
          {/* Left Column: Description & Specifications */}
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Software Overview
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
              {item.detailed_description || item.short_description}
            </p>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#cb0c9f" />
              <span>Tech Stack & Frameworks</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {item.tech_stack.map((tech, idx) => (
                <span key={idx} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.8rem', padding: '4px 12px', borderRadius: '8px', fontWeight: 600 }}>
                  {tech}
                </span>
              ))}
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#21D4FD" />
              <span>Key Features Included</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#82d616" />
                <span>Full Django 6 REST API & React 19 Soft UI Dashboard Source Code</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#82d616" />
                <span>ReportLab Automated PDF Invoicing & Quotation Engine</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#82d616" />
                <span>Automated Pillow WebP Image Compression Pipeline</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#82d616" />
                <span>Lifetime Updates & Commercial License Documentation</span>
              </li>
            </ul>
          </div>

          {/* Right Column: License Selection & Quote Order */}
          <div style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Select License Type</h4>
            
            {/* Regular License Option */}
            <div
              onClick={() => setSelectedLicense('regular')}
              style={{
                border: selectedLicense === 'regular' ? '2px solid #cb0c9f' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                background: selectedLicense === 'regular' ? 'rgba(203, 12, 159, 0.1)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Regular License</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#cb0c9f' }}>${item.regular_price}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Use in a single end product (End users not charged)</p>
            </div>

            {/* Extended License Option */}
            <div
              onClick={() => setSelectedLicense('extended')}
              style={{
                border: selectedLicense === 'extended' ? '2px solid #21D4FD' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                background: selectedLicense === 'extended' ? 'rgba(33, 212, 253, 0.1)' : 'transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Extended License</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#21D4FD' }}>${item.extended_price}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Use in an end product where end users can be charged (SaaS)</p>
            </div>

            {/* Actions */}
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={() => {
                setSelectedSoftwareDetail(null);
                openQuoteModal(item);
              }}
            >
              <FileText size={16} />
              <span>Send Custom Quote</span>
            </button>

            {item.live_preview_url && (
              <a
                href={item.live_preview_url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.85rem' }}
              >
                <ExternalLink size={16} />
                <span>Live Preview Link</span>
              </a>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'center', marginTop: '4px' }}>
              <Shield size={14} color="#82d616" />
              <span>Includes 6 Months Developer Support</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
