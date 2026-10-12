import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Receipt, ArrowRight, Share2, Printer } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';

const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [transactionId, setTransactionId] = useState(location.state?.transactionId || '');
  const [loading, setLoading] = useState(!order);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    if (!order && orderId) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${orderId}`);
          if (res.success) {
            setOrder(res.order);
            setTransactionId(`TXN-${res.order._id.slice(-8).toUpperCase()}`);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, order]);

  if (loading) {
    return <LoadingSpinner message="Fetching order confirmation..." />;
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.25rem 5rem', maxWidth: '680px' }}>
      <div
        className="card"
        style={{
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div
          style={{
            width: '76px',
            height: '76px',
            background: 'var(--success-light)',
            color: 'var(--success)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <CheckCircle2 size={44} />
        </div>

        <h2 style={{ fontSize: '1.9rem', marginBottom: '0.4rem' }}>Payment Successful!</h2>
        <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.5rem' }}>
          Thank you! Your order has been placed and confirmed by the restaurant.
        </p>

        {/* Highlight Card */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '14px',
            border: '1px solid var(--border)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748b' }}>Order Number:</span>
            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>#{order?.orderNumber || 'FD-100234'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748b' }}>Transaction ID:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{transactionId || 'TXN-98218731'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748b' }}>Estimated Delivery:</span>
            <span style={{ fontWeight: 700, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={15} /> 25-35 Minutes
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
            <span style={{ color: '#64748b' }}>Total Paid:</span>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
              {formatCurrency(order?.total || 0)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(`/orders/track/${order?._id}`)}
          >
            Track Order Live <ArrowRight size={18} />
          </button>

          <button
            className="btn btn-outline btn-lg"
            onClick={() => setIsInvoiceOpen(true)}
          >
            <Receipt size={18} /> View Invoice
          </button>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Link to="/home" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Invoice Modal */}
      <Modal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        title="Tax Invoice"
        maxWidth="600px"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <Printer size={16} /> Print
            </button>
            <button className="btn btn-primary" onClick={() => setIsInvoiceOpen(false)}>
              Done
            </button>
          </>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>FoodExpress Delivery</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Invoice #{order?.orderNumber}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
              <div>Date: {formatDate(order?.createdAt || new Date())}</div>
              <div>Payment: {order?.paymentMethod?.toUpperCase()}</div>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>Delivering to:</div>
            <div style={{ color: '#64748b' }}>
              {order?.deliveryAddress?.street}, {order?.deliveryAddress?.city}, {order?.deliveryAddress?.state} {order?.deliveryAddress?.zip}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>
                <th style={{ padding: '0.5rem 0' }}>Item</th>
                <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order?.items?.map((it, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.65rem 0' }}>{it.name}</td>
                  <td style={{ padding: '0.65rem 0', textAlign: 'center' }}>{it.quantity}</td>
                  <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(it.itemTotal || (it.price * it.quantity))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(order?.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Fee:</span>
              <span>{formatCurrency(order?.deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Taxes (8%):</span>
              <span>{formatCurrency(order?.tax)}</span>
            </div>
            {order?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                <span>Discount:</span>
                <span>-{formatCurrency(order?.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px solid #0f172a', paddingTop: '0.5rem' }}>
              <span>Total Paid:</span>
              <span>{formatCurrency(order?.total)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentSuccessPage;
