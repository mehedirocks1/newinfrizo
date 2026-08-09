import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchBlogPosts } from '../services/api';
import { Clock, User, ArrowRight, BookOpen, PenTool, ArrowUpRight } from 'lucide-react';
import { Pagination } from './Pagination';

export const BlogSection = () => {
  const navigate = useNavigate();
  const { searchQuery } = useApp();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 2;

  useEffect(() => {
    fetchBlogPosts().then((data) => setPosts(data));
  }, []);

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <section id="blog" style={{ padding: '60px 24px 80px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '10px' }}>
            <span>Section 4 • Premium Blogging System</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Engineering Insights & <span className="gradient-text">Tech Publications</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Rich articles, architectural deep dives, and performance optimization guides.
          </p>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <PenTool size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>No Blog Articles Yet</h3>
          <p style={{ fontSize: '0.85rem' }}>Log in to Django Admin at <strong>/admin/</strong> to add your first blog post!</p>
        </div>
      ) : (
        /* Blog Posts Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '28px' }}>
          {paginatedPosts.map((post) => (
            <div key={post.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              
              {/* Image Header */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => navigate(`/blog/${post.slug || post.id}`)}>
                <img
                  src={post.featured_image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <span className="badge badge-purple">{post.category_name || 'Tech'}</span>
                </div>
              </div>

              {/* Post Content */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                {/* Meta Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={14} color="#cb0c9f" />
                    <span>{post.author_name || 'Admin'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />
                    <span>{post.read_time_minutes || 5} min read</span>
                  </div>
                </div>

                <h3 
                  onClick={() => navigate(`/blog/${post.slug || post.id}`)}
                  style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-primary)', lineHeight: 1.4, cursor: 'pointer' }}
                >
                  {post.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1, lineHeight: 1.6 }}>
                  {post.summary}
                </p>

                {/* Read Action */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <button
                    onClick={() => navigate(`/blog/${post.slug || post.id}`)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#cb0c9f',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <BookOpen size={16} />
                    <span>Read Article</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {filteredPosts.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}

    </section>
  );
};
