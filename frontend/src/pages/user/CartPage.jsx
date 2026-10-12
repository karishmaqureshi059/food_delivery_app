import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartRestaurant,
    appliedCoupon,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get('/coupons/active');
        if (res.success) setActiveCoupons(res.coupons || []);
      } catch (err) {
        // ignore
      }
    };
    fetchCoupons();
  }, []);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput.trim());
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            background: '#fff',
            borderRadius: '20px',
            padding: '3.5rem 2rem',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
          <h2>Your Cart is Empty</h2>
          <p style={{ color: '#64748b', margin: '0.75rem 0 2rem' }}>
            Good food is always cooking! Explore top restaurants and fill up your cart with mouth-watering dishes.
          </p>
          <Link to="/restaurants" className="btn btn-primary btn-lg">
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2>Order Cart</h2>
          <p style={{ marginTop: '0.2rem' }}>
            Ordering from <strong style={{ color: '#0f172a' }}>{cartRestaurant?.name}</strong>
          </p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={clearCart}
          style={{ color: '#ef4444', borderColor: '#fca5a5' }}
        >
          Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item.cartItemId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'}
                      alt={item.name}
                      style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{item.name}</div>
                      {item.customization && item.customization.length > 0 && (
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          {item.customization.map((c) => `${c.name}: ${c.selected}`).join(' • ')}
                        </div>
                      )}
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)', marginTop: '4px' }}>
                        {formatCurrency(item.itemTotal)} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Total */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div className="qty-counter">
                      <button className="qty-btn" onClick={() => updateQuantity(item.cartItemId, -1)}>
                        <Minus size={14} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.cartItemId, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '1rem', minWidth: '70px', textAlign: 'right' }}>
                      {formatCurrency(item.itemTotal * item.quantity)}
                    </div>

                    <button
                      className="btn btn-outline btn-icon"
                      style={{ border: 'none', color: '#94a3b8' }}
                      onClick={() => removeFromCart(item.cartItemId)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Cooking Note */}
            <div style={{ marginTop: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem' }}>
                Any special cooking or delivery instructions?
              </label>
              <textarea
                className="form-control"
                placeholder="e.g. Please do not ring bell, leave at front gate, extra napkins..."
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>

          {/* Available Coupons Banner */}
          {activeCoupons.length > 0 && (
            <div className="card" style={{ padding: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={16} color="var(--primary)" /> Available Coupons
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                {activeCoupons.map((c) => (
                  <button
                    key={c._id}
                    className="btn btn-outline btn-sm"
                    style={{ background: '#fff7ed', borderColor: '#fdba74' }}
                    onClick={() => applyCoupon(c.code)}
                  >
                    🏷️ <strong>{c.code}</strong> - {c.description}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Bill Details */}
        <div className="card" style={{ padding: '1.5rem', background: '#fff' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Bill Summary
          </h3>

          {/* Coupon Input Form */}
          <div style={{ marginBottom: '1.25rem' }}>
            {appliedCoupon ? (
              <div
                style={{
                  background: 'var(--success-light)',
                  border: '1px solid var(--success)',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.875rem' }}>
                    '{appliedCoupon.code}' Applied!
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                    Savings of {formatCurrency(appliedCoupon.discountAmount)}
                  </div>
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: '#ef4444', borderColor: '#fca5a5', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={removeCoupon}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Coupon (e.g. WELCOME50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  style={{ textTransform: 'uppercase', fontSize: '0.875rem' }}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Breakdown Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.925rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Item Subtotal</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Partner Fee</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                {deliveryFee === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : formatCurrency(deliveryFee)}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Govt Taxes & Restaurant Packaging (8%)</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(tax)}</span>
            </div>

            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                <span>Coupon Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '2px dashed var(--border)',
                paddingTop: '0.85rem',
                marginTop: '0.5rem',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#0f172a'
              }}
            >
              <span>To Pay</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.78rem', margin: '1.25rem 0' }}>
            <ShieldCheck size={16} color="var(--success)" />
            <span>Guaranteed safe payment & contact-free delivery</span>
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={() => {
              localStorage.setItem('foodexpress_cart_note', instructions);
              navigate('/checkout');
            }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
