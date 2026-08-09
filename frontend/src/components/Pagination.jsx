import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          background: currentPage === 1 ? 'transparent' : 'var(--input-bg)',
          border: '1px solid var(--border-color)',
          color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            background: currentPage === page ? '#cb0c9f' : 'var(--input-bg)',
            border: currentPage === page ? '1px solid #cb0c9f' : '1px solid var(--border-color)',
            color: currentPage === page ? '#fff' : 'var(--text-primary)',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {page}
        </button>
      ))}

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          background: currentPage === totalPages ? 'transparent' : 'var(--input-bg)',
          border: '1px solid var(--border-color)',
          color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
