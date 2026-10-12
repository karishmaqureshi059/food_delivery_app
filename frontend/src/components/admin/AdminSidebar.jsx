import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Store,
  Users,
  ShoppingBag,
  Bike,
  CreditCard,
  MessageSquare,
  Tag,
  Bell,
  FileBarChart,
  TrendingUp,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Restaurants', path: '/admin/restaurants', icon: Store },
    { label: 'Menu & Food', path: '/admin/food', icon: UtensilsCrossed },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Delivery Partners', path: '/admin/delivery-partners', icon: Bike },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Reviews', path: '/admin/reviews', icon: MessageSquare },
    { label: 'Coupons & Offers', path: '/admin/coupons', icon: Tag },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },
    { label: 'Reports', path: '/admin/reports', icon: FileBarChart },
    { label: 'Revenue & Analytics', path: '/admin/revenue', icon: TrendingUp },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-brand">
        <span style={{ fontSize: '1.6rem' }}>🍔</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: '-0.02em' }}>
            FoodExpress
          </div>
          <div style={{ fontSize: '0.72rem', color: '#ff7a45', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Control Center
          </div>
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link
          to="/home"
          target="_blank"
          className="admin-nav-link"
          style={{ color: '#38bdf8' }}
        >
          <ExternalLink size={17} />
          <span>View Customer App</span>
        </Link>

        <button
          onClick={handleLogout}
          className="admin-nav-link"
          style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', color: '#f87171' }}
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
