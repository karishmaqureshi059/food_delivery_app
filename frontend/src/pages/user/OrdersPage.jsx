import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  RotateCcw,
  Receipt,
  XCircle,
  Star,
  CheckCircle2,
  Printer
} from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import RatingStars from '../../components/common/RatingStars';

const OrdersPage = () => {
  const { isAuthenticated } = useAuth();
  const { addToCart, clearCart } = useCart();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'delivered'

  // Cancel order modal
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind');

  // Rate order modal
  const [rateModalOrder, setRateModalOrder] = useState(null);
  const [restaurantRating, setRestaurantRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Invoice modal
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.success) setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/orders');
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  const handleCancelOrder = async () => {
    if (!cancelModalOrder) return;
    try {
      const res = await api.put(`/orders/${cancelModalOrder._id}/cancel`, {
        reason: cancelReason
      });
      if (res.success) {
        addToast('Order has been cancelled', 'info');
        setCancelModalOrder(null);
        fetchOrders();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleReorder = (order) => {
    clearCart();
    order.items.forEach((item) => {
      addToCart(
        {
          _id: item.foodId,
          name: item.name,
          price: item.price,
          isVeg: true,
          restaurantId: order.restaurantId
        },
        item.quantity,
        item.customization || [],
        order.restaurantId
      );
    });
    addToast('Items added to your cart!', 'success');
    navigate('/cart');
  };

  const handleSubmitRating = async () => {
    if (!rateModalOrder) return;
    try {
      const res = await api.post(`/orders/${rateModalOrder._id}/rate`, {
        restaurantRating,
        foodRating,
        deliveryRating,
        review: reviewComment
      });
      if (res.success) {
        addToast('Thank you for rating your order!', 'success');
        setRateModalOrder(null);
        fetchOrders();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your order history..." />;
  }

  const activeOrders = orders.filter(
    (o) => !['Delivered', 'Cancelled'].includes(o.orderStatus)
  );
  const pastOrders = orders.filter((o) =>
    ['Delivered', 'Cancelled'].includes(o.orderStatus)
  );

  const displayedOrders =
    activeTab === 'active'
      ? activeOrders
      : activeTab === 'delivered'
      ? pastOrders
      : orders;

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>My Orders</h2>
          <p style={{ marginTop: '0.2rem' }}>Track active deliveries and review previous culinary orders.</p>
        </div>

        {/* Tab filters */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'active' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({activeOrders.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'delivered' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab('delivered')}
          >
            Past Deliveries ({pastOrders.length})
          </button>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders found"
          description="Looks like you haven't placed an order in this tab yet."
          action={
            <Link to="/restaurants" className="btn btn-primary">
              Order Food Now
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {displayedOrders.map((order) => {
            const isCancellable = ['New Order', 'Confirmed'].includes(order.orderStatus);
            const isDelivered = order.orderStatus === 'Delivered';

            return (
              <div
                key={order._id}
                className="card"
                style={{
                  padding: '1.5rem',
                  borderLeft: isDelivered ? '4px solid var(--success)' : order.orderStatus === 'Cancelled' ? '4px solid var(--danger)' : '4px solid var(--primary)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img
                      src={order.restaurantId?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120'}
                      alt={order.restaurantId?.name}
                      style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '1.15rem' }}>{order.restaurantId?.name}</h3>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Order #{order.orderNumber} • {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.875rem'
                  }}
                >
                  <div style={{ color: '#475569', fontWeight: 600 }}>
                    {order.items?.map((it) => `${it.quantity}x ${it.name}`).join(' • ')}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    Delivery: {order.deliveryAddress?.street}, {order.deliveryAddress?.city} • Paid via {order.paymentMethod?.toUpperCase()}
                  </div>
                </div>

                {/* Actions Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {!['Delivered', 'Cancelled'].includes(order.orderStatus) && (
                      <Link to={`/orders/track/${order._id}`} className="btn btn-primary btn-sm">
                        Track Order Live <ArrowRight size={14} />
                      </Link>
                    )}

                    <button className="btn btn-outline btn-sm" onClick={() => setInvoiceOrder(order)}>
                      <Receipt size={14} /> View Invoice
                    </button>

                    <button className="btn btn-outline btn-sm" onClick={() => handleReorder(order)}>
                      <RotateCcw size={14} /> Reorder
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isDelivered && !order.ratings?.restaurant && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setRateModalOrder(order);
                          setRestaurantRating(5);
                          setFoodRating(5);
                          setDeliveryRating(5);
                          setReviewComment('');
                        }}
                      >
                        <Star size={14} /> Rate Experience
                      </button>
                    )}

                    {isDelivered && order.ratings?.restaurant && (
                      <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle2 size={16} /> Rated {order.ratings.restaurant}★
                      </span>
                    )}

                    {isCancellable && (
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                        onClick={() => setCancelModalOrder(order)}
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Modal */}
      <Modal
        isOpen={!!cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        title="Cancel Order"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setCancelModalOrder(null)}>
              Keep Order
            </button>
            <button className="btn btn-danger" onClick={handleCancelOrder}>
              Confirm Cancellation
            </button>
          </>
        }
      >
        <div>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>
            Are you sure you want to cancel order <strong>#{cancelModalOrder?.orderNumber}</strong>?
            If paid online, refund will be initiated instantly to your original payment method.
          </p>

          <div className="form-group">
            <label className="form-label">Reason for cancellation</label>
            <select
              className="form-control"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Delivery time is too long">Delivery time is too long</option>
              <option value="Forgot to apply coupon">Forgot to apply coupon</option>
              <option value="Wrong delivery address selected">Wrong delivery address selected</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Rate Order Modal */}
      <Modal
        isOpen={!!rateModalOrder}
        onClose={() => setRateModalOrder(null)}
        title="Rate Your Food & Delivery"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setRateModalOrder(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmitRating}>
              Submit Rating
            </button>
          </>
        }
      >
        <div>
          <div className="form-group">
            <label className="form-label">Restaurant Experience ({rateModalOrder?.restaurantId?.name})</label>
            <RatingStars rating={restaurantRating} onRate={setRestaurantRating} size={28} />
          </div>

          <div className="form-group">
            <label className="form-label">Food Taste & Freshness</label>
            <RatingStars rating={foodRating} onRate={setFoodRating} size={28} />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Partner & Packaging</label>
            <RatingStars rating={deliveryRating} onRate={setDeliveryRating} size={28} />
          </div>

          <div className="form-group">
            <label className="form-label">Write a Review (Optional)</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Tell us what you loved or how we can improve..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Invoice Modal */}
      <Modal
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        title="Tax Invoice"
        maxWidth="600px"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <Printer size={16} /> Print
            </button>
            <button className="btn btn-primary" onClick={() => setInvoiceOrder(null)}>
              Close
            </button>
          </>
        }
      >
        <div style={{ fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>{invoiceOrder?.restaurantId?.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Order #{invoiceOrder?.orderNumber}</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b' }}>
              <div>Date: {formatDate(invoiceOrder?.createdAt)}</div>
              <div>Status: {invoiceOrder?.orderStatus}</div>
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
              {invoiceOrder?.items?.map((it, idx) => (
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
              <span>{formatCurrency(invoiceOrder?.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Fee:</span>
              <span>{formatCurrency(invoiceOrder?.deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Taxes (8%):</span>
              <span>{formatCurrency(invoiceOrder?.tax)}</span>
            </div>
            {invoiceOrder?.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                <span>Discount:</span>
                <span>-{formatCurrency(invoiceOrder?.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px solid #0f172a', paddingTop: '0.5rem' }}>
              <span>Total:</span>
              <span>{formatCurrency(invoiceOrder?.total)}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrdersPage;
