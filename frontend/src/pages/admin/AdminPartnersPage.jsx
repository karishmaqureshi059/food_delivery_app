import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Bike, Phone, Star, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';

const AdminPartnersPage = () => {
  const { addToast } = useNotification();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: 'Motorcycle',
    licensePlate: ''
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/delivery-partners');
      if (res.success) setPartners(res.partners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleCreatePartner = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/delivery-partners', formData);
      if (res.success) {
        addToast('Delivery partner added to fleet', 'success');
        setIsModalOpen(false);
        fetchPartners();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/delivery-partners/${id}/toggle-status`);
      if (res.success) {
        addToast(res.message, 'info');
        fetchPartners();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeletePartner = async (id, name) => {
    if (!window.confirm(`Remove ${name} from delivery fleet?`)) return;
    try {
      const res = await api.delete(`/delivery-partners/${id}`);
      if (res.success) {
        addToast(res.message, 'success');
        fetchPartners();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Delivery Partner Fleet</h2>
          <p style={{ marginTop: '0.2rem' }}>Onboard couriers, monitor availability, and track delivery performance.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Delivery Partner
        </button>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Locating delivery fleet..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Contact Info</th>
                  <th>Vehicle Details</th>
                  <th>Performance</th>
                  <th>Fleet Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((partner) => (
                  <tr key={partner._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={partner.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                          alt={partner.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{partner.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {partner._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{partner.phone}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{partner.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{partner.vehicle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{partner.licensePlate}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.85rem' }}>
                        <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
                        {partner.rating} ★
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {partner.totalDeliveries} Deliveries
                      </div>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${partner.status === 'online' ? 'btn-outline-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => handleToggleStatus(partner._id)}
                      >
                        {partner.status === 'online' ? '🟢 Online' : '⚪ Offline'}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-icon"
                        style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                        onClick={() => handleDeletePartner(partner._id, partner.name)}
                        title="Remove partner"
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

      {/* Add Partner Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Delivery Partner"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreatePartner}>Save Partner</button>
          </>
        }
      >
        <form onSubmit={handleCreatePartner}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Johnson"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Mobile Phone</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0199"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@foodexpress.com"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <input
                type="text"
                className="form-control"
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                placeholder="e.g. Honda Civic or Scooter"
              />
            </div>
            <div className="form-group">
              <label className="form-label">License Plate #</label>
              <input
                type="text"
                className="form-control"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="NY-8821"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPartnersPage;
