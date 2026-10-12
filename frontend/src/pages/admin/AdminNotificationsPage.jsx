import React, { useState, useEffect } from 'react';
import { Bell, Send, Users, Tag, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

const AdminNotificationsPage = () => {
  const { addToast } = useNotification();
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('promo'); // 'promo' | 'order' | 'system'
  const [targetUserId, setTargetUserId] = useState(''); // '' means all
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifsRes, usersRes] = await Promise.all([
        api.get('/notifications/admin/all'),
        api.get('/users')
      ]);

      if (notifsRes.success) setNotifications(notifsRes.notifications || []);
      if (usersRes.success) setUsers(usersRes.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      addToast('Please provide both notification title and message', 'warning');
      return;
    }

    setSending(true);
    try {
      const res = await api.post('/notifications', {
        title: title.trim(),
        message: message.trim(),
        type,
        userId: targetUserId || null
      });

      if (res.success) {
        addToast(res.message || 'Notification broadcasted successfully!', 'success');
        setTitle('');
        setMessage('');
        fetchData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Push Notifications Broadcast</h2>
        <p style={{ marginTop: '0.2rem' }}>Send promotional marketing alerts, order notices, or system maintenance updates.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Create Broadcast Form */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bell size={18} color="var(--primary)" /> Compose Notification
          </h3>

          <form onSubmit={handleSendNotification}>
            <div className="form-group">
              <label className="form-label">Notification Type</label>
              <select
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="promo">🎉 Promotional / Offer Alert</option>
                <option value="order">📦 Order Update Alert</option>
                <option value="system">⚙️ System / Platform Notice</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select
                className="form-control"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
              >
                <option value="">📢 All Registered Customers (Broadcast)</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    👤 {u.name} ({u.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Headline / Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Flash Deal: 25% Off Tonight!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message Body</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Enter alert text that will appear in user's notification drawer..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={sending}>
              <Send size={16} /> {sending ? 'Transmitting...' : 'Send Notification'}
            </button>
          </form>
        </div>

        {/* Sent Notifications Log */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.1rem' }}>Notification Dispatch Log</h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{notifications.length} alerts sent</span>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading notification log..." />
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Notification</th>
                    <th>Target</th>
                    <th>Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No notifications sent yet</td>
                    </tr>
                  ) : (
                    notifications.map((n) => (
                      <tr key={n._id}>
                        <td>
                          <span
                            className={`badge ${
                              n.type === 'promo' ? 'badge-warning' : n.type === 'order' ? 'badge-primary' : 'badge-info'
                            }`}
                          >
                            {n.type}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{n.title}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{n.message}</div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          {n.userId ? `User: ${n.userId.name}` : '📢 Broadcast (All)'}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {formatDate(n.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
