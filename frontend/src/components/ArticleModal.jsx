import React from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Clock, Calendar, BookOpen } from 'lucide-react';

export const ArticleModal = () => {
  const { articleModalPost, setArticleModalPost } = useApp();

  if (!articleModalPost) return null;

  return (
    <div className="modal-overlay" onClick={() => setArticleModalPost(null)}>
      <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span className="badge badge-purple">{articleModalPost.category_name}</span>
          <button onClick={() => setArticleModalPost(null)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '16px', lineHeight: 1.3 }}>
          {articleModalPost.title}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#9ca3af', fontSize: '0.85rem', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={14} color="#cb0c9f" />
            <span>{articleModalPost.author_name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} />
            <span>{articleModalPost.read_time_minutes} min read</span>
          </div>
        </div>

        <img
          src={articleModalPost.featured_image}
          alt={articleModalPost.title}
          style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }}
        />

        <div style={{ fontSize: '0.95rem', color: '#d1d5db', lineHeight: 1.8, marginBottom: '24px' }}>
          <p style={{ fontWeight: 600, fontSize: '1.05rem', color: '#f3f4f6', marginBottom: '16px' }}>
            {articleModalPost.summary}
          </p>
          <p>
            {articleModalPost.content}
          </p>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', textAlign: 'right' }}>
          <button className="btn-secondary" onClick={() => setArticleModalPost(null)}>
            Close Article
          </button>
        </div>

      </div>
    </div>
  );
};
