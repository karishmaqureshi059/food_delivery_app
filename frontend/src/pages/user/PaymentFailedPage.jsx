import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft, Headphones } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const PaymentFailedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const reason = location.state?.reason || 'Transaction could not be completed by payment gateway.';
  const amount = location.state?.amount;

  return (
    <div className="container" style={{ padding: '4rem 1.25rem 5rem', maxWidth: '600px' }}>
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
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}
        >
          <AlertCircle size={44} />
        </div>

        <h2 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', color: '#991b1b' }}>Payment Failed</h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          We could not complete your payment request. No money was deducted from your account.
        </p>

        {/* Reason card */}
        <div
          style={{
            background: '#fff5f5',
            borderRadius: '12px',
            border: '1px solid #fed7d7',
            padding: '1rem',
            textAlign: 'left',
            marginBottom: '1.75rem'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: 700, marginBottom: '0.25rem' }}>
            FAILURE REASON:
          </div>
          <div style={{ color: '#742a2a', fontSize: '0.9rem' }}>{reason}</div>
          {amount && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
              Attempted Amount: <strong>{formatCurrency(amount)}</strong>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/checkout')}
          >
            <RefreshCw size={18} /> Retry Payment
          </button>

          <Link to="/cart" className="btn btn-outline btn-lg">
            Return to Cart
          </Link>
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
          Need assistance? <Link to="/profile" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact 24/7 Support</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
