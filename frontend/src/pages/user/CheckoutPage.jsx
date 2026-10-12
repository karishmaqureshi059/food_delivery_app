import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import {
  MapPin,
  Plus,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';
import Modal from '../../components/common/Modal';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const {
    cartItems,
    cartRestaurant,
    appliedCoupon,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    clearCart
  } = useCart();
  const { addToast } = useNotification();

  // Redirect if cart is empty or not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cartItems.length, navigate]);

  // Addresses
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: 'New York',
    state: 'NY',
    zip: '10001'
  });

  // Contact
  const [contactPhone, setContactPhone] = useState(user?.phone || '+1-555-0144');

  // Delivery instructions
  const [instructions, setInstructions] = useState([]);
  const [customNote, setCustomNote] = useState(() => localStorage.getItem('foodexpress_cart_note') || '');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'cod'
  const [cardInfo, setCardInfo] = useState({ number: '4242 •••• •••• 4242', exp: '12/28', cvv: '123' });
  const [upiId, setUpiId] = useState('johndoe@okaxis');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) {
      addToast('Please enter street and city', 'warning');
      return;
    }

    try {
      const res = await api.post('/users/addresses', newAddress);
      if (res.success) {
        setAddresses(res.addresses);
        setSelectedAddressIndex(res.addresses.length - 1);
        setIsAddAddressOpen(false);
        addToast('Delivery address saved', 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses[selectedAddressIndex] || {
      label: 'Current Location',
      street: user?.addresses?.[0]?.street || '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001'
    };

    setProcessing(true);

    try {
      // 1. Process mock payment if not COD
      if (paymentMethod !== 'cod' && simulateFailure) {
        // Direct simulation to failure page
        navigate('/payment-failed', {
          state: {
            reason: 'Card Issuer Declined: Insufficient test funds or transaction limit exceeded.',
            amount: total
          }
        });
        return;
      }

      // 2. Create actual order in Backend
      const orderPayload = {
        restaurantId: cartRestaurant?._id || cartRestaurant?.id,
        items: cartItems.map((item) => ({
          foodId: item.foodId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customization: item.customization || [],
          itemTotal: item.itemTotal * item.quantity
        })),
        deliveryAddress: {
          label: selectedAddress.label,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip: selectedAddress.zip,
          phone: contactPhone,
          instructions: `${instructions.join(', ')} ${customNote ? `| ${customNote}` : ''}`.trim()
        },
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        couponCode: appliedCoupon?.code || null,
        specialInstructions: customNote
      };

      const res = await api.post('/orders', orderPayload);

      if (res.success) {
        clearCart();
        navigate(`/payment-success/${res.order._id}`, {
          state: {
            order: res.order,
            transactionId: res.transactionId
          }
        });
      }
    } catch (err) {
      console.error(err);
      navigate('/payment-failed', {
        state: { reason: err.message, amount: total }
      });
    } finally {
      setProcessing(false);
    }
  };

  const toggleInstruction = (inst) => {
    if (instructions.includes(inst)) {
      setInstructions(instructions.filter((i) => i !== inst));
    } else {
      setInstructions([...instructions, inst]);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Checkout & Payment</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Left Column: Delivery Address & Payment Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Section 1: Delivery Address */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={18} color="var(--primary)" /> 1. Delivery Address
              </h3>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setIsAddAddressOpen(true)}
              >
                <Plus size={14} /> Add New Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>No saved delivery address found.</p>
                <button className="btn btn-primary btn-sm" onClick={() => setIsAddAddressOpen(true)}>
                  Add Address
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    style={{
                      border: selectedAddressIndex === idx ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: selectedAddressIndex === idx ? 'var(--primary-light)' : '#fff',
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                        📍 {addr.label || 'Address'}
                      </span>
                      {selectedAddressIndex === idx && (
                        <CheckCircle2 size={16} color="var(--primary)" />
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569' }}>{addr.street}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {addr.city}, {addr.state} {addr.zip}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Contact details */}
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <label className="form-label">Recipient Contact Number</label>
              <input
                type="text"
                className="form-control"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 555-0100"
              />
            </div>
          </div>

          {/* Section 2: Delivery Instructions */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Truck size={18} color="var(--primary)" /> 2. Delivery Instructions
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {[
                '🚪 Leave at door',
                '🔕 Do not ring bell',
                '📞 Call on arrival',
                '👮 Leave with security guard',
                '🧤 Contactless delivery'
              ].map((inst) => (
                <button
                  key={inst}
                  type="button"
                  className={`btn btn-sm ${instructions.includes(inst) ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => toggleInstruction(inst)}
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CreditCard size={18} color="var(--primary)" /> 3. Select Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Option 1: UPI */}
              <label
                style={{
                  border: paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: paymentMethod === 'upi' ? 'var(--primary-light)' : '#fff',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <QrCode size={24} color="#ff5621" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>UPI / Instant Pay</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Google Pay, PhonePe, Paytm, or BHIM UPI</div>
                </div>
              </label>

              {paymentMethod === 'upi' && (
                <div style={{ padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '10px', marginLeft: '2rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>UPI ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okaxis"
                  />
                </div>
              )}

              {/* Option 2: Card */}
              <label
                style={{
                  border: paymentMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: paymentMethod === 'card' ? 'var(--primary-light)' : '#fff',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <CreditCard size={24} color="#ff5621" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Credit / Debit Card</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Visa, MasterCard, Amex, RuPay</div>
                </div>
              </label>

              {paymentMethod === 'card' && (
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', marginLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.85rem' }}>Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardInfo.number}
                      onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={cardInfo.exp}
                        onChange={(e) => setCardInfo({ ...cardInfo, exp: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>CVV</label>
                      <input
                        type="password"
                        className="form-control"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Option 3: Cash on Delivery */}
              <label
                style={{
                  border: paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: paymentMethod === 'cod' ? 'var(--primary-light)' : '#fff',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <Banknote size={24} color="#10b981" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pay in cash or QR code when courier arrives</div>
                </div>
              </label>
            </div>

            {/* Test Payment Simulation Helper */}
            <div style={{ marginTop: '1.25rem', padding: '0.85rem', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#991b1b', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                />
                Simulate Payment Failure (To test Payment Failed retry flow)
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Preview & Submit */}
        <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '5.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Order Summary
          </h3>

          <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
            From: <strong style={{ color: '#0f172a' }}>{cartRestaurant?.name}</strong>
          </div>

          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(item.itemTotal * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
              <span>Taxes & Fees</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            style={{ marginTop: '1.5rem' }}
            disabled={processing}
            onClick={handlePlaceOrder}
          >
            {processing ? 'Processing...' : `Place Order • ${formatCurrency(total)}`}
          </button>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        title="Add New Delivery Address"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsAddAddressOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreateAddress}>
              Save Address
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateAddress}>
          <div className="form-group">
            <label className="form-label">Label</label>
            <select
              className="form-control"
              value={newAddress.label}
              onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Street Address / Apartment</label>
            <input
              type="text"
              className="form-control"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              placeholder="e.g. 742 Evergreen Terrace, Apt 5"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-control"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">ZIP Code</label>
              <input
                type="text"
                className="form-control"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
