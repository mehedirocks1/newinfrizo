import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { submitQuoteRequest } from '../services/api';
import { X, Send, FileText, CheckCircle } from 'lucide-react';

export const QuoteModal = () => {
  const { quoteModalOpen, setQuoteModalOpen, selectedSoftwareForQuote, showToast } = useApp();
  
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    company_name: '',
    project_title: selectedSoftwareForQuote ? `Customization for ${selectedSoftwareForQuote.title}` : '',
    detailed_requirements: '',
    estimated_budget: selectedSoftwareForQuote ? selectedSoftwareForQuote.regular_price * 2 : 1000,
  });

  const [submitted, setSubmitted] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');

  if (!quoteModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      software_item: selectedSoftwareForQuote ? selectedSoftwareForQuote.id : null,
    };
    const res = await submitQuoteRequest(payload);
    setQuoteNumber(res.quote_number || 'Q-2026-REC');
    setSubmitted(true);
    showToast(`Quotation Request Sent! Ref #${res.quote_number || 'Q-2026-REC'}`);
  };

  return (
    <div className="modal-overlay" onClick={() => setQuoteModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7928CA 0%, #FF0080 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Request Custom Software Quote</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Submit project specifications & get an itemized PDF quote</p>
            </div>
          </div>
          <button onClick={() => setQuoteModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(130, 214, 22, 0.15)', color: '#82d616', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Quotation Sent Successfully!</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '16px' }}>
              We have received your specifications and dispatched a confirmation email to <strong>{formData.client_email}</strong>.
            </p>
            <div style={{ background: 'rgba(203, 12, 159, 0.15)', border: '1px solid rgba(203, 12, 159, 0.3)', padding: '12px', borderRadius: '12px', color: '#e293d3', fontWeight: 700, display: 'inline-block', marginBottom: '24px' }}>
              Quote Reference ID: #{quoteNumber}
            </div>
            <div>
              <button className="btn-primary" onClick={() => { setSubmitted(false); setQuoteModalOpen(false); }}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {selectedSoftwareForQuote && (
              <div style={{ background: 'rgba(203, 12, 159, 0.1)', border: '1px solid rgba(203, 12, 159, 0.25)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', color: '#e293d3' }}>
                Selected Item: <strong>{selectedSoftwareForQuote.title}</strong>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="client@company.com"
                  value={formData.client_email}
                  onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.client_phone}
                  onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Company Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Project Title</label>
              <input
                type="text"
                required
                placeholder="Enterprise E-Commerce SaaS Customization"
                value={formData.project_title}
                onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Detailed Project Requirements & Custom Add-ons</label>
              <textarea
                rows="4"
                required
                placeholder="Describe your custom features, integration requirements, timeline expectations, and tech stack preferences..."
                value={formData.detailed_requirements}
                onChange={(e) => setFormData({ ...formData, detailed_requirements: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                <Send size={18} />
                <span>Submit Quote Specification</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
