import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

const AdminDashboardPage = () => {
  const { addToast } = useNotification();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/reports/dashboard');
      if (res.success) {
        setStats(res.stats);
        setRecentOrders(res.recentOrders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleQuickStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `Quick updated from Dashboard to ${newStatus}`
      });
      if (res.success) {
        addToast(`Order updated to: ${newStatus}`, 'success');
        fetchDashboardData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Calculating real-time analytics..." />;
  }

  return (
    <div>
      {/* KPI Stats Grid */}
      <div className="grid-stats" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="TOTAL REVENUE"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change="+18.4%"
          icon={DollarSign}
          color="#10b981"
          bgLight="#ecfdf5"
        />
        <StatCard
          title="TOTAL ORDERS"
          value={stats?.totalOrders || 0}
          change="+12.5%"
          icon={ShoppingBag}
          color="#ff5621"
          bgLight="var(--primary-light)"
        />
        <StatCard
          title="ACTIVE RESTAURANTS"
          value={stats?.totalRestaurants || 0}
          change="+4 new"
          icon={Store}
          color="#8b5cf6"
          bgLight="#ede9fe"
        />
        <StatCard
          title="REGISTERED USERS"
          value={stats?.totalUsers || 0}
          change="+24.2%"
          icon={Users}
          color="#3b82f6"
          bgLight="#eff6ff"
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          background: '#fff',
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center' }}>
          QUICK ACTIONS:
        </span>
        <Link to="/admin/restaurants" className="btn btn-primary btn-sm">
          <Plus size={14} /> Add Restaurant
        </Link>
        <Link to="/admin/food" className="btn btn-outline btn-sm">
          <Plus size={14} /> Add Menu Item
        </Link>
        <Link to="/admin/coupons" className="btn btn-outline btn-sm">
          <Plus size={14} /> Create Coupon
        </Link>
        <Link to="/admin/notifications" className="btn btn-outline btn-sm">
          <Bell size={14} /> Broadcast Notification
        </Link>
      </div>

      {/* Order Status Breakdown Pills */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Active Order Volume by Stage</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
          {['New Order', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => {
            const count = stats?.statusCounts?.[status] || 0;
            return (
              <div
                key={status}
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}
              >
                <span className={`badge ${getStatusBadgeClass(status)}`} style={{ padding: '0.2rem 0.5rem' }}>
                  {status}
                </span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Live Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Order Feed</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Latest live orders placed across all restaurants</p>
          </div>
          <Link to="/admin/orders" className="btn btn-outline-primary btn-sm">
            View All Orders ({stats?.totalOrders})
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Quick Update</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      #{order.orderNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.userId?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{order.userId?.phone}</div>
                    </td>
                    <td>{order.restaurantId?.name || 'Restaurant'}</td>
                    <td>{order.items?.length} items</td>
                    <td style={{ fontWeight: 800 }}>{formatCurrency(order.total)}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                        value={order.orderStatus}
                        onChange={(e) => handleQuickStatusUpdate(order._id, e.target.value)}
                      >
                        <option value="New Order">New Order</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready for Pickup">Ready for Pickup</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
