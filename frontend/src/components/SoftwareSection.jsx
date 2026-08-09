import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchSoftwareItems } from '../services/api';
import { Star, Play, ExternalLink, FileText, Info } from 'lucide-react';
import { Pagination } from './Pagination';

export const SoftwareSection = () => {
  const navigate = useNavigate();
  const { openQuoteModal, setVideoModalUrl, searchQuery } = useApp();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  useEffect(() => {
    fetchSoftwareItems().then((data) => setItems(data));
  }, []);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.short_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <section id="software" style={{ padding: '60px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '10px' }}>
            <span>Section 1 • Software Selling Management</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Enterprise <span className="gradient-text">Software & SaaS Products</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Envato Market style software templates with live video demos, tech stack details, & custom quote pricing.
          </p>
        </div>
      </div>

      {/* Software Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '28px' }}>
        {paginatedItems.map((software) => (
          <div key={software.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Image Header with Badge Overlay */}
            <div
              style={{ position: 'relative', height: '200px', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => navigate(`/software/${software.id}`)}
            >
              <img
                src={software.thumbnail}
                alt={software.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                <span className="badge badge-purple">v{software.version}</span>
                {software.is_featured && <span className="badge badge-blue">Featured</span>}
              </div>

              {/* Video Demo Button Overlay */}
              {software.video_demo_url && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setVideoModalUrl(software.video_demo_url);
                  }}
                  style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Play size={14} color="#cb0c9f" fill="#cb0c9f" />
                  <span>Video Demo</span>
                </button>
              )}
            </div>

            {/* Card Content */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              
              {/* Category & Ratings */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: '#cb0c9f', fontWeight: 700, textTransform: 'uppercase' }}>
                  {software.category_name}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                  <Star size={14} fill="#f59e0b" />
                  <span>{software.rating_average}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({software.sales_count} sales)</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3
                onClick={() => navigate(`/software/${software.id}`)}
                style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                {software.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5, flex: 1 }}>
                {software.short_description}
              </p>

              {/* Tech Stack Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {software.tech_stack.map((tech, idx) => (
                  <span key={idx} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px' }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Footer Row: Pricing & Buttons */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Regular License</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>${software.regular_price}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.8rem' }} onClick={() => navigate(`/software/${software.id}`)}>
                    <Info size={14} />
                    <span>Details</span>
                  </button>

                  <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.8rem' }} onClick={() => openQuoteModal(software)}>
                    <FileText size={14} />
                    <span>Get Quote</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

    </section>
  );
};
