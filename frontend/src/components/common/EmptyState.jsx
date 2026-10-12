import React from 'react';

const EmptyState = ({ icon = '🍽️', title = 'No results found', description = 'Try adjusting your search or filters.', action = null }) => {
  return (
    <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1', margin: '1rem 0' }}>
      <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>{title}</h3>
      <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
