import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Clock, Calendar, MessageSquare, Send, CheckCircle2, Bookmark } from 'lucide-react';

export const BlogDetailModal = () => {
  const { articleModalPost, setArticleModalPost, showToast } = useApp();
  
  const [comments, setComments] = useState([
    { id: 1, author: 'David Miller', date: 'August 8, 2026', text: 'Excellent article! The WebP signal hook integration in Django drastically improved our media storage costs.' },
    { id: 2, author: 'Sophia Chen', date: 'August 9, 2026', text: 'Loved the Soft UI design breakdown. Very helpful guide!' }
  ]);

  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  if (!articleModalPost) return null;

  const post = articleModalPost;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: authorName.trim() || 'Guest Reader',
        date: 'Just Now',
        text: newComment.trim(),
      }
    ]);
    setNewComment('');
    setAuthorName('');
    showToast('Comment Posted Successfully!');
  };

  return (
    <div className="modal-overlay" onClick={() => setArticleModalPost(null)}>
      <div className="modal-content" style={{ maxWidth: '850px', padding: 0, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: 'var(--nav-bg)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-purple">{post.category_name || 'Publication'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Professional Engineering Article</span>
          </div>
          <button onClick={() => setArticleModalPost(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Editorial Container */}
        <div style={{ padding: '32px', maxHeight: '80vh', overflowY: 'auto' }}>
          
          {/* Article Title */}
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
            {post.title}
          </h1>

          {/* Author Meta Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7928CA 0%, #FF0080 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                {post.author_name ? post.author_name[0] : 'A'}
              </div>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block' }}>{post.author_name || 'Admin Author'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead System Architect</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#cb0c9f" />
              <span>{post.read_time_minutes || 5} min read</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} />
              <span>August 2026</span>
            </div>
          </div>

          {/* Featured Hero Banner */}
          <img
            src={post.featured_image || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'}
            alt={post.title}
            style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '20px', marginBottom: '28px', border: '1px solid var(--border-color)' }}
          />

          {/* Summary Box */}
          <div style={{ background: 'rgba(203, 12, 159, 0.08)', borderLeft: '4px solid #cb0c9f', padding: '20px', borderRadius: '12px', marginBottom: '28px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cb0c9f', marginBottom: '6px' }}>Executive Key Takeaways</h4>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6 }}>
              {post.summary}
            </p>
          </div>

          {/* Main Content Paragraphs */}
          <div style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.8, marginBottom: '40px' }}>
            <p style={{ marginBottom: '16px' }}>
              {post.content || 'In modern enterprise software engineering, combining a bulletproof Django REST backend with a fast React 19 frontend creates the ultimate developer velocity. From automated ReportLab PDF invoice generation to Pillow WebP image compression, every layer must be tuned for ultra-fast performance.'}
            </p>
            <p style={{ marginBottom: '16px' }}>
              By enforcing structured database models with autocommit connections and atomic view wrapping, the backend handles high concurrency with ease while maintaining absolute financial ledger integrity.
            </p>
          </div>

          {/* Comments Section */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="#cb0c9f" />
              <span>Discussion ({comments.length})</span>
            </h3>

            {/* List Existing Comments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{comment.author}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comment.date}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Post a Comment Form */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--input-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Leave a Comment</h4>
              
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none' }}
              />

              <textarea
                rows="3"
                required
                placeholder="Write your thoughts or questions about this article..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}
              />

              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', padding: '8px 20px', fontSize: '0.85rem' }}>
                <Send size={14} />
                <span>Post Comment</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
