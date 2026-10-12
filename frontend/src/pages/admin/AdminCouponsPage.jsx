import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';

const AdminCouponsPage = () => {
  const { addToast } = useNotification();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 200,
    maxDiscount: 150,
    expiryDate: '2027-12-31'
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      if (res.success) setCoupons(res.coupons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/coupons', formData);
      if (res.success) {
        addToast(`Coupon "${res.coupon.code}" created!`, 'success');
        setIsModalOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/coupons/${id}/toggle-status`);
      if (res.success) {
        addToast(res.message, 'info');
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.success) {
        addToast('Coupon deleted', 'success');
        fetchCoupons();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Coupons & Promotional Offers</h2>
          <p style={{ marginTop: '0.2rem' }}>Configure discount campaigns, min-order thresholds, and expiration controls.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading promotion campaigns..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Promo Code</th>
                  <th>Discount Rule</th>
                  <th>Min Order</th>
                  <th>Max Savings</th>
                  <th>Redemptions</th>
                  <th>Valid Until</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#ff5621', color: '#fff', padding: '0.25rem 0.65rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.85rem' }}>
                        <Tag size={13} /> {c.code}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
                        {c.description}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% OFF`
                        : c.discountType === 'flat'
                        ? `${formatCurrency(c.discountValue)} FLAT OFF`
                        : 'Free Delivery'}
                    </td>
                    <td>{formatCurrency(c.minOrder)}</td>
                    <td>{formatCurrency(c.maxDiscount)}</td>
                    <td>
                      <strong>{c.usageCount || 0}</strong> uses
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {formatDate(c.expiryDate)}
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${c.isActive ? 'btn-outline-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => handleToggleStatus(c._id)}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-icon"
                        style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                        onClick={() => handleDelete(c._id, c.code)}
                        title="Delete coupon"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Coupon"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreateCoupon}>Create Coupon</button>
          </>
        }
      >
        <form onSubmit={handleCreateCoupon}>
          <div className="form-group">
            <label className="form-label">Coupon Code (Uppercase)</label>
            <input
              type="text"
              className="form-control"
              style={{ textTransform: 'uppercase', fontWeight: 700 }}
              placeholder="e.g. FLASH30"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. 30% off your midnight order"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Discount Type</label>
              <select
                className="form-control"
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Cash (₹)</option>
                <option value="free_delivery">Free Delivery</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Discount Value (% or ₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Minimum Order (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Max Cap Discount (₹)</label>
              <input
                type="number"
                className="form-control"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCouponsPage;
