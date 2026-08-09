import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { submitFreelancerApplication } from '../services/api';
import { X, UserPlus, CheckCircle } from 'lucide-react';

export const FreelancerApplyModal = () => {
  const { freelancerModalOpen, setFreelancerModalOpen, showToast } = useApp();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    title: '',
    bio: '',
    expected_hourly_rate: 50,
    skills_text: 'Django, React, PostgreSQL',
    portfolio_url: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!freelancerModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitFreelancerApplication(formData);
    setSubmitted(true);
    showToast(`Application Submitted! Our admin will review your profile.`);
  };

  return (
    <div className="modal-overlay" onClick={() => setFreelancerModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #17AD37 0%, #98EC2D 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Apply to Join Talent Network</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Submit your portfolio for admin review & approval</p>
            </div>
          </div>
          <button onClick={() => setFreelancerModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(130, 214, 22, 0.15)', color: '#82d616', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={36} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Application Received!</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '24px' }}>
              Thank you, <strong>{formData.full_name}</strong>. Our review committee will inspect your portfolio and send you an email at <strong>{formData.email}</strong> upon approval.
            </p>
            <button className="btn-primary" onClick={() => { setSubmitted(false); setFreelancerModalOpen(false); }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="elena@talent.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="Senior Django & React Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Expected Hourly Rate ($/hr)</label>
                <input
                  type="number"
                  required
                  value={formData.expected_hourly_rate}
                  onChange={(e) => setFormData({ ...formData, expected_hourly_rate: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Key Skills (Comma Separated)</label>
              <input
                type="text"
                required
                placeholder="Python, Django 6, React 19, PostgreSQL, Docker"
                value={formData.skills_text}
                onChange={(e) => setFormData({ ...formData, skills_text: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#d1d5db', marginBottom: '6px' }}>Bio & Experience Summary</label>
              <textarea
                rows="3"
                required
                placeholder="Briefly describe your years of experience, past projects, and primary achievements..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
              />
            </div>

            <div style={{ marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', background: 'linear-gradient(135deg, #17AD37 0%, #98EC2D 100%)', color: '#000', fontWeight: 800 }}>
                <span>Submit Candidate Application</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
