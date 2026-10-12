import React, { useState, useEffect } from 'react';
import { Search, CreditCard, DollarSign, RotateCcw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';

const AdminPaymentsPage = () => {
  const { addToast } = useNotification();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [search, setSearch] = useState('');

  // Refund Modal State
  const [refundPayment, setRefundPayment] = useState(null);
  const [refundReason, setRefundReason] = useState('Customer complaint / Order cancelled');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter) queryParams.set('status', statusFilter);
      if (methodFilter) queryParams.set('method', methodFilter);
      if (search) queryParams.set('search', search);

      const res = await api.get(`/payments?${queryParams.toString()}`);
      if (res.success) setPayments(res.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, methodFilter]);

  const handleRefund = async () => {
    if (!refundPayment) return;
    try {
      const res = await api.post(`/payments/${refundPayment._id}/refund`, {
        reason: refundReason,
        refundAmount: refundPayment.amount
      });
      if (res.success) {
        addToast(`Transaction ${refundPayment.transactionId} refunded successfully`, 'success');
        setRefundPayment(null);
        fetchPayments();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Payment & Financial Records</h2>
          <p style={{ marginTop: '0.2rem' }}>Audit gateway transactions, track payment flows, and process customer refunds.</p>
        </div>
      </div>

      {/* Filter Bar */}
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
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPayments()}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Payment Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
          <option value="">All Methods</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Auditing transactions..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Timestamp</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No payment records found</td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                        {p.transactionId}
                      </td>
                      <td>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          #{p.orderId?.orderNumber || 'FD-ORDER'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.userId?.name || 'Customer'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.userId?.email}</div>
                      </td>
                      <td style={{ fontWeight: 800 }}>{formatCurrency(p.amount)}</td>
                      <td>
                        <span className="badge badge-default" style={{ textTransform: 'uppercase' }}>
                          {p.method}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            p.status === 'success'
                              ? 'badge-success'
                              : p.status === 'refunded'
                              ? 'badge-warning'
                              : p.status === 'failed'
                              ? 'badge-danger'
                              : 'badge-default'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {formatDate(p.createdAt)}
                      </td>
                      <td>
                        {p.status === 'success' && (
                          <button
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: '#f59e0b', borderColor: '#fcd34d' }}
                            onClick={() => setRefundPayment(p)}
                          >
                            <RotateCcw size={12} /> Refund
                          </button>
                        )}
                        {p.status === 'refunded' && (
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Refunded</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      <Modal
        isOpen={!!refundPayment}
        onClose={() => setRefundPayment(null)}
        title="Issue Transaction Refund"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setRefundPayment(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleRefund}>Process Refund</button>
          </>
        }
      >
        <div>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            Are you sure you want to refund <strong>{formatCurrency(refundPayment?.amount || 0)}</strong> to customer for transaction <strong>{refundPayment?.transactionId}</strong>?
          </p>

          <div className="form-group">
            <label className="form-label">Refund Reason</label>
            <input
              type="text"
              className="form-control"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              required
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPaymentsPage;
