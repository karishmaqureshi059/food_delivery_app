import React from 'react';
import { Menu, Bell, User as UserIcon, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title = 'Dashboard', onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="btn btn-outline btn-icon"
          style={{ display: window.innerWidth > 992 ? 'none' : 'flex' }}
          onClick={onToggleSidebar}
        >
          <Menu size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt="Admin"
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ display: window.innerWidth < 640 ? 'none' : 'block' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: '0.72rem', color: '#ff5621', fontWeight: 600 }}>SYSTEM ADMINISTRATOR</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
