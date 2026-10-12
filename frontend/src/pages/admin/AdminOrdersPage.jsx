import React, { useState, useEffect } from 'react';
import { Search, Eye, Bike, CheckCircle2, Clock, Filter, Printer, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';

const ORDER_STATUS_FLOW = [
  'New Order',
  'Confirmed',
  'Preparing',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

const AdminOrdersPage = () => {
  const { addToast } = useNotification();
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignPartnerOrder, setAssignPartnerOrder] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter && statusFilter !== 'All') queryParams.set('status', statusFilter);
      if (search) queryParams.set('search', search);

      const [ordersRes, partnersRes] = await Promise.all([
        api.get(`/orders?${queryParams.toString()}`),
        api.get('/delivery-partners')
      ]);

      if (ordersRes.success) setOrders(ordersRes.orders || []);
      if (partnersRes.success) setPartners(partnersRes.partners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated by Admin to ${newStatus}`
      });
      if (res.success) {
        addToast(`Order updated to: ${newStatus}`, 'success');
        fetchData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleAssignPartner = async () => {
    if (!assignPartnerOrder || !selectedPartnerId) return;
    try {
      const res = await api.put(`/orders/${assignPartnerOrder._id}/assign-partner`, {
        partnerId: selectedPartnerId
      });
      if (res.success) {
        addToast('Delivery partner assigned successfully', 'success');
        setAssignPartnerOrder(null);
        fetchData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Order Operations Management</h2>
          <p style={{ marginTop: '0.2rem' }}>Live order status lifecycle, partner dispatch, and fulfillment tracking.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={fetchData}>
          <RefreshCw size={14} /> Refresh Feed
        </button>
      </div>

      {/* Filter Tabs by Status Flow */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem',
          marginBottom: '1rem'
        }}
      >
        {['All', ...ORDER_STATUS_FLOW].map((status) => (
          <button
            key={status}
            className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by Order ID (e.g. FD-100234)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Retrieving orders..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Amount</th>
                  <th>Courier</th>
                  <th>Workflow Status</th>
                  <th>Advance Stage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No orders found for selected status</td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id}>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        #{ord.orderNumber}
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400 }}>{formatDate(ord.createdAt)}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ord.userId?.name || 'Customer'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.userId?.phone}</div>
                      </td>
                      <td style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ord.restaurantId?.name}</td>
                      <td>
                        <div style={{ fontWeight: 800 }}>{formatCurrency(ord.total)}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.paymentMethod?.toUpperCase()}</div>
                      </td>
                      <td>
                        {ord.deliveryPartnerId ? (
                          <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                            🛵 {ord.deliveryPartnerId.name}
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                            onClick={() => {
                              setAssignPartnerOrder(ord);
                              setSelectedPartnerId(partners[0]?._id || '');
                            }}
                          >
                            Assign Courier
                          </button>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(ord.orderStatus)}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-control"
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                          value={ord.orderStatus}
                          onChange={(e) => handleStatusUpdate(ord._id, e.target.value)}
                        >
                          {ORDER_STATUS_FLOW.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline btn-icon"
                          onClick={() => setSelectedOrder(ord)}
                          title="View order details & invoice"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Partner Modal */}
      <Modal
        isOpen={!!assignPartnerOrder}
        onClose={() => setAssignPartnerOrder(null)}
        title="Assign Delivery Courier"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setAssignPartnerOrder(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAssignPartner}>Assign Partner</button>
          </>
        }
      >
        <div>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            Assign an active courier to deliver order <strong>#{assignPartnerOrder?.orderNumber}</strong>.
          </p>

          <div className="form-group">
            <label className="form-label">Available Courier Fleet</label>
            <select
              className="form-control"
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
            >
              {partners.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.vehicle} • {p.status})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* View Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder?.orderNumber}`}
        maxWidth="620px"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <Printer size={16} /> Print Receipt
            </button>
            <button className="btn btn-primary" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>CUSTOMER</div>
              <div style={{ fontWeight: 700 }}>{selectedOrder?.userId?.name}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{selectedOrder?.userId?.email}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{selectedOrder?.userId?.phone}</div>
            </div>

            <div>
              <div style={{ fontWeight: 700, color: '#64748b', fontSize: '0.8rem' }}>DELIVERY ADDRESS</div>
              <div style={{ fontWeight: 700 }}>{selectedOrder?.deliveryAddress?.label}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                {selectedOrder?.deliveryAddress?.street}, {selectedOrder?.deliveryAddress?.city}
              </div>
              {selectedOrder?.deliveryAddress?.instructions && (
                <div style={{ color: 'var(--primary)', fontSize: '0.78rem', marginTop: '2px' }}>
                  Note: "{selectedOrder.deliveryAddress.instructions}"
                </div>
              )}
            </div>
          </div>

          <h4 style={{ marginBottom: '0.75rem' }}>Ordered Items</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>
                <th style={{ padding: '0.4rem 0' }}>Item</th>
                <th style={{ padding: '0.4rem 0', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.4rem 0', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder?.items?.map((it, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.5rem 0' }}>
                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                    {it.customization?.length > 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {it.customization.map((c) => `${c.name}: ${c.selected}`).join(', ')}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>{it.quantity}</td>
                  <td style={{ padding: '0.5rem 0', textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(it.itemTotal || (it.price * it.quantity))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(selectedOrder?.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Fee:</span>
              <span>{formatCurrency(selectedOrder?.deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Taxes:</span>
              <span>{formatCurrency(selectedOrder?.tax)}</span>
            </div>
            {selectedOrder?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                <span>Discount ({selectedOrder.couponCode}):</span>
                <span>-{formatCurrency(selectedOrder.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px solid #0f172a', paddingTop: '0.5rem' }}>
              <span>Total Paid:</span>
              <span>{formatCurrency(selectedOrder?.total)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
