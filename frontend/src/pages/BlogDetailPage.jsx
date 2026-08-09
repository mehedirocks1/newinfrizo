import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBlogPost } from '../services/api';
import { ArrowLeft, Clock, Calendar, User, Share2, MessageSquare } from 'lucide-react';

export const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPost(slug).then(data => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', minHeight: '80vh' }}>Loading...</div>;
  if (!post) return <div style={{ padding: '60px', textAlign: 'center', minHeight: '80vh' }}>Blog post not found</div>;

  return (
    <div style={{ minHeight: '80vh' }}>
      
      {/* Blog Header & Hero */}
      <div style={{ position: 'relative', height: '400px', width: '100%' }}>
        <img src={post.featured_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          <div style={{ maxWidth: '800px', width: '100%', padding: '24px', textAlign: 'center', color: '#fff' }}>
            
            <button 
              onClick={() => navigate('/blog')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', marginBottom: '24px', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <ArrowLeft size={16} />
              Back to Articles
            </button>

            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-purple" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                {post.category_name}
              </span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '24px' }}>
              {post.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: '0.9rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={16} color="#cb0c9f" />
                <span style={{ fontWeight: 600, color: '#fff' }}>{post.author_name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={16} />
                <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} />
                <span>{post.read_time_minutes} Min Read</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Executive Summary Callout */}
        <div style={{ background: 'var(--input-bg)', borderLeft: '4px solid #cb0c9f', padding: '24px', borderRadius: '0 12px 12px 0', marginBottom: '40px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Executive Summary</h4>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic' }}>
            {post.summary}
          </p>
        </div>

        {/* Rich Text Article Body */}
        <div className="article-body" style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.8, marginBottom: '60px' }}>
          {/* If the content contains HTML (from CKEditor), we use dangerouslySetInnerHTML. Otherwise just render it. */}
          {post.content.includes('<') ? (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          ) : (
            <p>{post.content}</p>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Share this article:</span>
            <button style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1877F2', cursor: 'pointer' }}>
              <Share2 size={16} />
            </button>
          </div>

          <button className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '20px' }}>
            <MessageSquare size={16} />
            <span>Join Discussion (12)</span>
          </button>

        </div>

      </div>
    </div>
  );
};
