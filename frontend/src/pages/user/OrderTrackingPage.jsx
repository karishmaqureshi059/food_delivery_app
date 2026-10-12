import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Phone,
  MessageSquare,
  Bike,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Play,
  RotateCcw,
  Receipt
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';

const ORDER_STEPS = [
  { id: 'New Order', label: 'Order Placed', desc: 'Received by system', icon: '📝' },
  { id: 'Confirmed', label: 'Restaurant Accepted', desc: 'Order confirmed by kitchen', icon: '👨‍🍳' },
  { id: 'Preparing', label: 'Food Preparing', desc: 'Chef is crafting your meal', icon: '🍳' },
  { id: 'Ready for Pickup', label: 'Picked Up', desc: 'Courier picked up package', icon: '📦' },
  { id: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier is heading to your door', icon: '🛵' },
  { id: 'Delivered', label: 'Delivered', desc: 'Meal delivered. Enjoy!', icon: '🎉' }
];

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const { addToast } = useNotification();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.success) {
        setOrder(res.order);
        setPartner(res.order.deliveryPartnerId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 8 seconds for live sync if active
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Determine current step index
  const currentStepIndex = ORDER_STEPS.findIndex(
    (step) => step.id === (order?.orderStatus || 'New Order')
  );

  // Simulation handler: advances status to next step to showcase live workflow
  const handleSimulateNextStep = async () => {
    if (!order) return;
    const nextIdx = currentStepIndex + 1;
    if (nextIdx >= ORDER_STEPS.length) {
      addToast('Order has already reached final "Delivered" state', 'info');
      return;
    }

    const nextStatus = ORDER_STEPS[nextIdx].id;
    setSimulating(true);

    try {
      // Direct admin update API simulation
      const res = await api.put(`/orders/${order._id}/status`, {
        status: nextStatus,
        note: `Workflow progressed to ${ORDER_STEPS[nextIdx].label}`
      });

      if (res.success) {
        setOrder(res.order);
        addToast(`Order advanced to: ${ORDER_STEPS[nextIdx].label}`, 'success');
      }
    } catch (err) {
      // Fallback if not admin role: update local state for preview
      setOrder((prev) => ({
        ...prev,
        orderStatus: nextStatus,
        trackingTimeline: [
          ...(prev.trackingTimeline || []),
          { status: nextStatus, timestamp: new Date(), note: `Simulated step: ${nextStatus}` }
        ]
      }));
      addToast(`Order advanced to: ${ORDER_STEPS[nextIdx].label}`, 'success');
    } finally {
      setSimulating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Connecting to live delivery satellites..." />;
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Order Live Tracking</h2>
          <p style={{ marginTop: '0.2rem' }}>
            Order <strong>#{order.orderNumber}</strong> • {order.restaurantId?.name}
          </p>
        </div>

        {/* Live Simulator Helper Button */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSimulateNextStep}
            disabled={simulating || currentStepIndex >= ORDER_STEPS.length - 1}
          >
            <Play size={14} /> Simulate Next Workflow Step
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Visual Step-by-Step Timeline */}
        <div className="card" style={{ padding: '2rem' }}>
          {/* Estimated Time Header */}
          <div
            style={{
              background: order.orderStatus === 'Delivered' ? 'var(--success-light)' : 'var(--primary-light)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: order.orderStatus === 'Delivered' ? 'var(--success)' : 'var(--primary)', textTransform: 'uppercase' }}>
                {order.orderStatus === 'Delivered' ? 'DELIVERY COMPLETE' : 'ESTIMATED ARRIVAL'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {order.orderStatus === 'Delivered' ? 'Delivered to Door 🎉' : '20-30 Minutes'}
              </div>
            </div>
            <div style={{ fontSize: '2.5rem' }}>
              {order.orderStatus === 'Delivered' ? '✅' : '🛵'}
            </div>
          </div>

          {/* 6-Step Visual Timeline */}
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>Delivery Progress</h3>

          <div className="timeline-container">
            {ORDER_STEPS.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isPending = idx > currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`timeline-item ${isPast ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}
                >
                  <div className="timeline-dot">
                    {isPast ? <CheckCircle2 size={16} /> : isCurrent ? <Bike size={16} /> : idx + 1}
                  </div>

                  <div style={{ marginLeft: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>{step.icon}</span>
                      <div className="timeline-title" style={{ color: isPending ? '#94a3b8' : '#0f172a' }}>
                        {step.label}
                      </div>
                    </div>
                    <div className="timeline-note" style={{ color: isPending ? '#cbd5e1' : '#64748b' }}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Delivery Partner & Destination Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Delivery Partner Info */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Delivery Partner</h4>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <img
                src={partner?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                alt={partner?.name || 'Courier'}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a' }}>
                  {partner?.name || 'Mike Johnson'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {partner?.vehicle || 'Honda Hornet'} • {partner?.licensePlate || 'NY-8821-EX'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
                  ★ {partner?.rating || '4.9'} Delivery Rating
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <a
                href={`tel:${partner?.phone || '+15551001'}`}
                className="btn btn-outline btn-sm"
                style={{ gap: '0.4rem' }}
              >
                <Phone size={14} /> Call Courier
              </a>
              <button
                className="btn btn-outline btn-sm"
                style={{ gap: '0.4rem' }}
                onClick={() => addToast('Opening courier live chat...', 'info')}
              >
                <MessageSquare size={14} /> Message
              </button>
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Destination Address</h4>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {order.deliveryAddress?.label || 'Home'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zip}
                </div>
                {order.deliveryAddress?.instructions && (
                  <div style={{ fontSize: '0.78rem', color: '#ff5621', marginTop: '4px' }}>
                    Note: "{order.deliveryAddress.instructions}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary & Total */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Order Details</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#64748b' }}>
              {order.items?.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{it.quantity}x {it.name}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>
                    {formatCurrency(it.itemTotal || (it.price * it.quantity))}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>
                <span>Total Paid</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
