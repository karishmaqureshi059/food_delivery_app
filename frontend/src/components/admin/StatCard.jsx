import React from 'react';

const StatCard = ({ title, value, change, icon: Icon, color = '#ff5621', bgLight = 'var(--primary-light)' }) => {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{title}</span>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: bgLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
        {value}
      </div>

      {change && (
        <div style={{ fontSize: '0.78rem', color: change.startsWith('+') ? '#10b981' : '#64748b', fontWeight: 600 }}>
          {change} <span style={{ color: '#94a3b8', fontWeight: 400 }}>vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
