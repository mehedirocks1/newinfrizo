import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Play } from 'lucide-react';

export const VideoModal = () => {
  const { videoModalUrl, setVideoModalUrl } = useApp();

  if (!videoModalUrl) return null;

  return (
    <div className="modal-overlay" onClick={() => setVideoModalUrl(null)}>
      <div className="modal-content" style={{ maxWidth: '800px', padding: 0, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cb0c9f', fontWeight: 700 }}>
            <Play size={18} fill="#cb0c9f" />
            <span>Software Video Demo Preview</span>
          </div>
          <button onClick={() => setVideoModalUrl(null)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Video Preview"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
