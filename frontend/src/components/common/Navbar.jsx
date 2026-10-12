import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import {
  ShoppingBag,
  MapPin,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  ChevronDown,
  Clock,
  Heart,
  Menu,
  X
} from 'lucide-react';
import Modal from './Modal';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout, selectedLocation, setSelectedLocation } = useAuth();
  const { totalItemsCount } = useCart();
  const { unreadCount, inAppNotifications, markNotificationRead } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLocModalOpen, setIsLocModalOpen] = useState(false);
  const [newLocationInput, setNewLocationInput] = useState(selectedLocation);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSaveLocation = (e) => {
    e.preventDefault();
    if (newLocationInput.trim()) {
      setSelectedLocation(newLocationInput.trim());
      setIsLocModalOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            {/* Brand */}
            <Link to={isAuthenticated ? '/home' : '/'} className="brand">
              <span className="brand-icon">🍔</span>
              <span>FoodExpress</span>
            </Link>

            {/* Location Selector */}
            <div
              className="nav-location-picker"
              onClick={() => setIsLocModalOpen(true)}
              title="Click to change delivery address"
            >
              <MapPin size={16} color="#ff5621" style={{ flexShrink: 0 }} />
              <span className="nav-location-text">{selectedLocation}</span>
              <ChevronDown size={14} color="#64748b" style={{ flexShrink: 0 }} />
            </div>

            {/* Desktop Navigation Links */}
            <ul className="nav-links" style={{ display: window.innerWidth < 768 ? 'none' : 'flex' }}>
              <li>
                <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/restaurants" className={`nav-link ${isActive('/restaurants') ? 'active' : ''}`}>
                  Restaurants
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/orders" className={`nav-link ${isActive('/orders') ? 'active' : ''}`}>
                    My Orders
                  </Link>
                </li>
              )}
            </ul>

            {/* Actions: Search, Notifications, Cart, Profile */}
            <div className="nav-actions">
              {/* Search Shortcut */}
              <Link to="/restaurants" className="btn btn-outline btn-icon" title="Search food & restaurants">
                <Search size={18} />
              </Link>

              {/* In-App Notifications */}
              {isAuthenticated && (
                <div style={{ position: 'relative' }}>
                  <button
                    className="btn btn-outline btn-icon"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    title="Notifications"
                    style={{ position: 'relative' }}
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="cart-button-badge" style={{ background: '#ef4444' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown for Notifications */}
                  {isNotifOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '115%',
                        width: '320px',
                        background: '#fff',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border)',
                        padding: '1rem',
                        zIndex: 200
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.95rem' }}>Notifications</h4>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{unreadCount} unread</span>
                      </div>
                      <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {inAppNotifications.length === 0 ? (
                          <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>No notifications yet</p>
                        ) : (
                          inAppNotifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                markNotificationRead(notif._id);
                                setIsNotifOpen(false);
                                if (notif.type === 'order') navigate('/orders');
                              }}
                              style={{
                                padding: '0.65rem',
                                borderRadius: '8px',
                                background: notif.isRead ? '#fff' : '#f8fafc',
                                borderLeft: notif.isRead ? '2px solid transparent' : '3px solid var(--primary)',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              <div style={{ fontWeight: 600, color: '#0f172a' }}>{notif.title}</div>
                              <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>{notif.message}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart Button with Count Badge */}
              <Link to="/cart" className="btn btn-outline btn-icon" style={{ position: 'relative' }} title="View Cart">
                <ShoppingBag size={18} />
                {totalItemsCount > 0 && (
                  <span className="cart-button-badge">
                    {totalItemsCount}
                  </span>
                )}
              </Link>

              {/* User Session or Login */}
              {isAuthenticated ? (
                <div style={{ position: 'relative' }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    style={{ padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)' }}
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={user?.name}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '115%',
                        width: '210px',
                        background: '#fff',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-lg)',
                        border: '1px solid var(--border)',
                        padding: '0.5rem',
                        zIndex: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.25rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                      </div>

                      <Link
                        to="/profile"
                        className="btn btn-outline"
                        style={{ justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <UserIcon size={16} /> My Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="btn btn-outline"
                        style={{ justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Clock size={16} /> My Orders
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="btn btn-outline"
                          style={{ justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#ff5621' }}
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Shield size={16} /> Admin Panel
                        </Link>
                      )}

                      <button
                        className="btn btn-outline"
                        style={{ justifyContent: 'flex-start', border: 'none', padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: '#ef4444' }}
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link to="/login" className="btn btn-outline btn-sm">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary btn-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Change Location Modal */}
      <Modal
        isOpen={isLocModalOpen}
        onClose={() => setIsLocModalOpen(false)}
        title="Choose Delivery Location"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsLocModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSaveLocation}>
              Set Location
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveLocation}>
          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <input
              type="text"
              className="form-control"
              value={newLocationInput}
              onChange={(e) => setNewLocationInput(e.target.value)}
              placeholder="e.g. 123 Main St, Manhattan, NY"
              autoFocus
            />
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
            Quick locations:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[
              '123 Main St, Manhattan, NY',
              '456 Burger Ave, Brooklyn, NY',
              '789 Sushi Lane, SoHo, NY',
              '987 Health Blvd, Midtown, NY'
            ].map((loc) => (
              <button
                key={loc}
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setNewLocationInput(loc);
                  setSelectedLocation(loc);
                  setIsLocModalOpen(false);
                }}
              >
                📍 {loc}
              </button>
            ))}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Navbar;
