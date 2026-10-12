import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, ShieldCheck, Eye, Ban, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import { formatDate, formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';

const AdminUsersPage = () => {
  const { addToast } = useNotification();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected user for details modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingUserOrders, setLoadingUserOrders] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (statusFilter) queryParams.set('status', statusFilter);

      const res = await api.get(`/users?${queryParams.toString()}`);
      if (res.success) setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleBlock = async (userId, currentBlocked) => {
    try {
      const res = await api.put(`/users/${userId}/toggle-block`);
      if (res.success) {
        addToast(res.message, 'info');
        setUsers(users.map((u) => (u._id === userId ? { ...u, isBlocked: res.isBlocked } : u)));
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setLoadingUserOrders(true);
    try {
      const res = await api.get(`/users/${user._id}`);
      if (res.success) {
        setUserOrders(res.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUserOrders(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Manage Users</h2>
          <p style={{ marginTop: '0.2rem' }}>Customer registry, order history, and account moderation.</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, minWidth: '260px', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by user name, email, or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Status:</label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked / Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading user directory..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No users found matching query</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt={user.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {user._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>{user.email}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{user.phone}</div>
                      </td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-default'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.isBlocked ? 'badge-danger' : 'badge-success'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleViewUser(user)}
                            title="View user details & history"
                          >
                            <Eye size={14} /> View
                          </button>

                          {user.role !== 'admin' && (
                            <button
                              className={`btn btn-sm ${user.isBlocked ? 'btn-outline-primary' : 'btn-outline'}`}
                              style={user.isBlocked ? {} : { color: '#ef4444', borderColor: '#fca5a5' }}
                              onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                            >
                              {user.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details & History Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={`User Profile: ${selectedUser?.name}`}
        maxWidth="680px"
        footer={
          <button className="btn btn-primary" onClick={() => setSelectedUser(null)}>
            Close
          </button>
        }
      >
        <div>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <img
              src={selectedUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={selectedUser?.name}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>{selectedUser?.name}</h3>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{selectedUser?.email} • {selectedUser?.phone}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '4px' }}>
                <span className={`badge ${selectedUser?.isBlocked ? 'badge-danger' : 'badge-success'}`}>
                  {selectedUser?.isBlocked ? 'Suspended' : 'Active Account'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Joined {formatDate(selectedUser?.createdAt)}</span>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>User Order History ({userOrders.length})</h4>
          {loadingUserOrders ? (
            <p>Loading orders...</p>
          ) : userOrders.length === 0 ? (
            <p style={{ color: '#64748b' }}>No previous orders found for this user.</p>
          ) : (
            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {userOrders.map((ord) => (
                <div
                  key={ord._id}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      #{ord.orderNumber} • {ord.restaurantId?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {formatDate(ord.createdAt)} • {ord.items?.length} items
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800 }}>{formatCurrency(ord.total)}</div>
                    <span className="badge badge-default" style={{ fontSize: '0.7rem' }}>{ord.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsersPage;
