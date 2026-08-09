import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchFreelancers } from '../services/api';
import { Star, Award, CheckCircle2, UserPlus, Mail } from 'lucide-react';
import { Pagination } from './Pagination';

export const FreelancerSection = () => {
  const navigate = useNavigate();
  const { setFreelancerModalOpen, searchQuery } = useApp();
  const [freelancers, setFreelancers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  useEffect(() => {
    fetchFreelancers().then((data) => setFreelancers(data));
  }, []);

  const filteredFreelancers = freelancers.filter((f) =>
    f.freelancer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFreelancers.length / ITEMS_PER_PAGE);
  const paginatedFreelancers = filteredFreelancers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <section id="freelancers" style={{ padding: '60px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-green" style={{ marginBottom: '10px' }}>
            <span>Section 3 • Freelancer Talent Marketplace</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Vetted Top-Rated <span className="gradient-text-green">Freelance Engineers</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Hire top 1% developers, designers & cloud architects or submit your application to join our talent network.
          </p>
        </div>

        <button className="btn-secondary" style={{ padding: '10px 20px', borderColor: '#16a34a', color: '#16a34a' }} onClick={() => setFreelancerModalOpen(true)}>
          <UserPlus size={16} />
          <span>Apply as Freelancer</span>
        </button>
      </div>

      {/* Freelancer Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {paginatedFreelancers.map((freelancer) => (
          <div key={freelancer.id} className="glass-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Header: Photo + Info + Top Rated Badge */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={freelancer.profile_photo}
                  alt={freelancer.freelancer_name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #82d616' }}
                />
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#82d616', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={12} />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {freelancer.freelancer_name}
                  </h3>
                  {freelancer.is_top_rated && (
                    <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                      <Award size={12} /> Top Rated
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cb0c9f', fontWeight: 600, marginTop: '2px' }}>
                  {freelancer.title}
                </p>
              </div>
            </div>

            {/* Bio */}
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1, lineHeight: 1.5 }}>
              {freelancer.bio}
            </p>

            {/* Skills Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {freelancer.skills.map((skill, idx) => (
                <span key={idx} style={{ background: 'rgba(130, 214, 22, 0.15)', border: '1px solid rgba(130, 214, 22, 0.3)', color: '#15803d', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  {skill.name}
                </span>
              ))}
            </div>

            {/* Stats & Hire Button */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700 }}>
                  <Star size={14} fill="#f59e0b" />
                  <span>{freelancer.average_rating}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({freelancer.jobs_completed_count} jobs)</span>
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', display: 'block', marginTop: '4px' }}>
                  ${freelancer.hourly_rate}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>/hr</span>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => navigate(`/freelancers/${freelancer.id}`)}>
                  View Profile
                </button>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'linear-gradient(135deg, #17AD37 0%, #98EC2D 100%)', color: '#000', fontWeight: 800 }} onClick={() => navigate(`/freelancers/${freelancer.id}`)}>
                  <Mail size={14} />
                  <span>Hire Me</span>
                </button>
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
