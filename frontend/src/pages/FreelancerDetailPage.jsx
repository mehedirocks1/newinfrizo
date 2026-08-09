import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchFreelancer } from '../services/api';
import { Briefcase, Star, CheckCircle, ArrowLeft, Mail, Clock, Award } from 'lucide-react';

export const FreelancerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setFreelancerModalOpen } = useApp();
  
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreelancer(id).then(data => {
      setFreelancer(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', minHeight: '80vh' }}>Loading...</div>;
  if (!freelancer) return <div style={{ padding: '60px', textAlign: 'center', minHeight: '80vh' }}>Freelancer not found</div>;

  return (
    <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto', minHeight: '80vh' }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/freelancers')}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '30px', fontWeight: 600 }}
      >
        <ArrowLeft size={18} />
        Back to Freelancers Directory
      </button>

      {/* Profile Header */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <img 
            src={freelancer.profile_photo} 
            alt={freelancer.freelancer_name} 
            style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg-primary)' }} 
          />
          {freelancer.is_top_rated && (
            <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#f59e0b', color: '#fff', padding: '6px', borderRadius: '50%', border: '2px solid var(--bg-primary)', display: 'flex' }} title="Top Rated Talent">
              <Award size={18} />
            </div>
          )}
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
          {freelancer.freelancer_name}
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#cb0c9f', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>
          <Briefcase size={18} />
          <span>{freelancer.title}</span>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.6, marginBottom: '24px' }}>
          {freelancer.bio}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
          {freelancer.skills?.map((skill, idx) => (
            <span key={idx} style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.9rem', padding: '6px 16px', borderRadius: '20px', fontWeight: 600 }}>
              {skill.name}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            className="btn-primary" 
            style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '30px' }}
            onClick={() => setFreelancerModalOpen(true)}
          >
            <Mail size={18} />
            <span>Hire Me</span>
          </button>
        </div>

      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Star size={32} fill="#f59e0b" color="#f59e0b" style={{ marginBottom: '12px' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{freelancer.average_rating}</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Average Rating</span>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <CheckCircle size={32} color="#16a34a" style={{ marginBottom: '12px' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{freelancer.jobs_completed_count}</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Jobs Completed</span>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Clock size={32} color="#38bdf8" style={{ marginBottom: '12px' }} />
          <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>${freelancer.hourly_rate}</span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hourly Rate</span>
        </div>

      </div>

    </div>
  );
};
