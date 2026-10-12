import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
  User,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send
} from 'lucide-react';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import RestaurantCard from '../../components/restaurant/RestaurantCard';

const ProfilePage = () => {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'addresses' | 'payments' | 'favorites' | 'notifications' | 'support'

  // Personal details form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: 'New York', state: 'NY', zip: '10001' });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState(user?.paymentMethods || []);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: 'card', label: 'Visa ending 5555', details: '•••• •••• •••• 5555' });

  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);

  // Support FAQs state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [supportTicket, setSupportTicket] = useState({ subject: '', message: '', submitted: false });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/profile');
    } else if (user) {
      setName(user.name);
      setPhone(user.phone);
      setAvatar(user.avatar);
      setAddresses(user.addresses || []);
      setPaymentMethods(user.paymentMethods || []);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (activeTab === 'favorites') {
      const fetchFavs = async () => {
        setLoadingFavs(true);
        try {
          const res = await api.get('/users/favorites');
          if (res.success) setFavorites(res.favorites || []);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingFavs(false);
        }
      };
      fetchFavs();
    } else if (activeTab === 'notifications') {
      const fetchNotifs = async () => {
        try {
          const res = await api.get('/notifications');
          if (res.success) setNotifications(res.notifications || []);
        } catch (err) {
          console.error(err);
        }
      };
      fetchNotifs();
    }
  }, [activeTab]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({ name, phone, avatar });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/addresses', newAddress);
      if (res.success) {
        setAddresses(res.addresses);
        setIsAddAddressOpen(false);
        addToast('Address added successfully', 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteAddress = async (addrId) => {
    try {
      const res = await api.delete(`/users/addresses/${addrId}`);
      if (res.success) {
        setAddresses(res.addresses);
        addToast('Address removed', 'info');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/payment-methods', newPayment);
      if (res.success) {
        setPaymentMethods(res.paymentMethods);
        setIsAddPaymentOpen(false);
        addToast('Payment method saved', 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeletePaymentMethod = async (payId) => {
    try {
      const res = await api.delete(`/users/payment-methods/${payId}`);
      if (res.success) {
        setPaymentMethods(res.paymentMethods);
        addToast('Payment method removed', 'info');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportTicket.subject || !supportTicket.message) {
      addToast('Please fill out ticket subject and message', 'warning');
      return;
    }
    setSupportTicket({ ...supportTicket, submitted: true });
    addToast('Support ticket #TCK-8812 created! We will reply within 1 hour.', 'success');
  };

  const faqs = [
    { q: 'How long does delivery take?', a: 'Standard delivery takes between 25 to 40 minutes depending on your distance from the restaurant and traffic conditions.' },
    { q: 'What payment methods are supported?', a: 'We accept Google Pay, PhonePe, Paytm, all Credit and Debit cards (Visa/Mastercard), and Cash on Delivery.' },
    { q: 'Can I cancel my order?', a: 'Orders can be cancelled before the restaurant begins cooking (within New Order and Confirmed status) with 100% instant refund.' },
    { q: 'How do I apply coupon codes?', a: 'You can apply coupons directly in the Cart page before proceeding to Checkout.' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Profile Navigation Tabs */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <button
            className={`btn btn-outline btn-block ${activeTab === 'details' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '0.65rem 0.85rem' }}
            onClick={() => setActiveTab('details')}
          >
            <User size={16} /> Personal Details
          </button>

          <button
            className={`btn btn-outline btn-block ${activeTab === 'addresses' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '0.65rem 0.85rem' }}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={16} /> Saved Addresses ({addresses.length})
          </button>

          <button
            className={`btn btn-outline btn-block ${activeTab === 'payments' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '0.65rem 0.85rem' }}
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard size={16} /> Payment Methods
          </button>

          <button
            className={`btn btn-outline btn-block ${activeTab === 'favorites' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '0.65rem 0.85rem' }}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={16} /> Favorites
          </button>

          <button
            className={`btn btn-outline btn-block ${activeTab === 'notifications' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '0.65rem 0.85rem' }}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={16} /> Notifications
          </button>

          <button
            className={`btn btn-outline btn-block ${activeTab === 'support' ? 'btn-primary' : ''}`}
            style={{ justifyContent: 'flex-start', border: 'none', padding: '0.65rem 0.85rem' }}
            onClick={() => setActiveTab('support')}
          >
            <HelpCircle size={16} /> Help & Support
          </button>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <button
              className="btn btn-outline btn-block"
              style={{ justifyContent: 'flex-start', border: 'none', color: '#ef4444', padding: '0.65rem 0.85rem' }}
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Right Column: Tab Content */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* TAB 1: Personal Details */}
          {activeTab === 'details' && (
            <div>
              <h3 style={{ marginBottom: '1.25rem' }}>Personal Information</h3>
              <form onSubmit={handleProfileSave}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Read-only)</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ''}
                    disabled
                    style={{ background: '#f8fafc' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Avatar Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Saved Delivery Addresses</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddAddressOpen(true)}>
                  <Plus size={14} /> Add Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <p style={{ color: '#64748b' }}>No saved addresses. Add an address for faster checkout.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      style={{
                        padding: '1rem',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                          📍 {addr.label}
                        </div>
                        <div style={{ color: '#475569', fontSize: '0.85rem', marginTop: '2px' }}>
                          {addr.street}, {addr.city}, {addr.state} {addr.zip}
                        </div>
                      </div>

                      <button
                        className="btn btn-outline btn-icon"
                        style={{ border: 'none', color: '#ef4444' }}
                        onClick={() => handleDeleteAddress(addr._id)}
                        title="Delete address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Payment Methods */}
          {activeTab === 'payments' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Saved Payment Methods</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddPaymentOpen(true)}>
                  <Plus size={14} /> Add Method
                </button>
              </div>

              {paymentMethods.length === 0 ? (
                <p style={{ color: '#64748b' }}>No saved payment methods.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {paymentMethods.map((pay) => (
                    <div
                      key={pay._id}
                      style={{
                        padding: '1rem',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          💳 {pay.label}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{pay.details}</div>
                      </div>

                      <button
                        className="btn btn-outline btn-icon"
                        style={{ border: 'none', color: '#ef4444' }}
                        onClick={() => handleDeletePaymentMethod(pay._id)}
                        title="Delete payment method"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Favorites */}
          {activeTab === 'favorites' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>My Favorite Restaurants</h3>
              {loadingFavs ? (
                <p>Loading favorites...</p>
              ) : favorites.length === 0 ? (
                <p style={{ color: '#64748b' }}>You haven't bookmarked any favorite restaurants yet.</p>
              ) : (
                <div className="grid-restaurants">
                  {favorites.map((rest) => (
                    <RestaurantCard key={rest._id} restaurant={rest} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Notifications */}
          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Notification Log</h3>
              {notifications.length === 0 ? (
                <p style={{ color: '#64748b' }}>No notifications received.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      style={{
                        padding: '1rem',
                        borderRadius: '10px',
                        background: '#f8fafc',
                        borderLeft: '4px solid var(--primary)'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{n.title}</div>
                      <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>{n.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Help & Support */}
          {activeTab === 'support' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Frequently Asked Questions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#fff',
                        border: 'none',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      {openFaqIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openFaqIndex === idx && (
                      <div style={{ padding: '0 1rem 1rem', color: '#475569', fontSize: '0.9rem', lineHeight: 1.5 }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h3>Contact Support Ticket</h3>
              <form onSubmit={handleSupportSubmit} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Question regarding recent refund or driver tip"
                    value={supportTicket.subject}
                    onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe how our support team can help you..."
                    value={supportTicket.message}
                    onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <Send size={15} /> Submit Support Ticket
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        title="Add New Address"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsAddAddressOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddAddress}>Save</button>
          </>
        }
      >
        <form onSubmit={handleAddAddress}>
          <div className="form-group">
            <label className="form-label">Label</label>
            <select
              className="form-control"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Street</label>
            <input
              type="text"
              className="form-control"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Zip</label>
              <input
                type="text"
                className="form-control"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        title="Add Payment Method"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsAddPaymentOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddPaymentMethod}>Save</button>
          </>
        }
      >
        <form onSubmit={handleAddPaymentMethod}>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-control"
              value={newPayment.type}
              onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
            >
              <option value="card">Debit / Credit Card</option>
              <option value="upi">UPI ID</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Label</label>
            <input
              type="text"
              className="form-control"
              value={newPayment.label}
              onChange={(e) => setNewPayment({ ...newPayment, label: e.target.value })}
              placeholder="e.g. Master Card or GPay ID"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Details / Account / UPI ID</label>
            <input
              type="text"
              className="form-control"
              value={newPayment.details}
              onChange={(e) => setNewPayment({ ...newPayment, details: e.target.value })}
              placeholder="•••• •••• •••• 1234 or name@upi"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
