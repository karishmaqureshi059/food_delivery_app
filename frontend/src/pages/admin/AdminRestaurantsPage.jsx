import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Store, Star, Search } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { useNotification } from '../../context/NotificationContext';

const AdminRestaurantsPage = () => {
  const { addToast } = useNotification();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisine: '',
    address: '',
    phone: '',
    deliveryTime: '25-35 min',
    deliveryFee: 40,
    minOrder: 150,
    priceRange: '₹₹',
    image: '',
    isVegOnly: false
  });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/restaurants/admin/all${search ? `?search=${search}` : ''}`);
      if (res.success) setRestaurants(res.restaurants || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleOpenAdd = () => {
    setEditingRestaurant(null);
    setFormData({
      name: '',
      description: '',
      cuisine: 'Italian, Pizza',
      address: '',
      phone: '+1-555-0100',
      deliveryTime: '25-35 min',
      deliveryFee: 40,
      minOrder: 150,
      priceRange: '₹₹',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
      isVegOnly: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rest) => {
    setEditingRestaurant(rest);
    setFormData({
      name: rest.name,
      description: rest.description,
      cuisine: Array.isArray(rest.cuisine) ? rest.cuisine.join(', ') : rest.cuisine,
      address: rest.address,
      phone: rest.phone,
      deliveryTime: rest.deliveryTime,
      deliveryFee: rest.deliveryFee,
      minOrder: rest.minOrder,
      priceRange: rest.priceRange,
      image: rest.image,
      isVegOnly: rest.isVegOnly
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        const res = await api.put(`/restaurants/${editingRestaurant._id}`, formData);
        if (res.success) {
          addToast('Restaurant updated successfully', 'success');
          setIsModalOpen(false);
          fetchRestaurants();
        }
      } else {
        const res = await api.post('/restaurants', formData);
        if (res.success) {
          addToast('New restaurant created successfully', 'success');
          setIsModalOpen(false);
          fetchRestaurants();
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.put(`/restaurants/${id}/toggle-status`);
      if (res.success) {
        addToast(res.message, 'info');
        fetchRestaurants();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleApproval = async (id) => {
    try {
      const res = await api.put(`/restaurants/${id}/approval`);
      if (res.success) {
        addToast(res.message, 'info');
        fetchRestaurants();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" and all its menu foods?`)) return;
    try {
      const res = await api.delete(`/restaurants/${id}`);
      if (res.success) {
        addToast(res.message, 'success');
        fetchRestaurants();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Manage Restaurants</h2>
          <p style={{ marginTop: '0.2rem' }}>Onboard dining partners, approve stores, and configure delivery parameters.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Restaurant
        </button>
      </div>

      {/* Restaurants Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading restaurant network..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Cuisine</th>
                  <th>Delivery & Min</th>
                  <th>Rating</th>
                  <th>Approval</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((rest) => (
                  <tr key={rest._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={rest.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100'}
                          alt={rest.name}
                          style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{rest.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rest.address}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {Array.isArray(rest.cuisine) ? rest.cuisine.join(', ') : rest.cuisine}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rest.deliveryTime}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Fee: {formatCurrency(rest.deliveryFee)} • Min: {formatCurrency(rest.minOrder)}
                      </div>
                    </td>
                    <td>
                      <span className="rating-pill">
                        <Star size={11} fill="#fff" stroke="#fff" />
                        {rest.rating?.toFixed(1)}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${rest.isApproved ? 'btn-outline' : 'btn-primary'}`}
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => handleToggleApproval(rest._id)}
                      >
                        {rest.isApproved ? 'Approved' : 'Pending Approval'}
                      </button>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${rest.isActive ? 'btn-outline' : 'btn-danger'}`}
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => handleToggleStatus(rest._id)}
                      >
                        {rest.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-outline btn-icon"
                          onClick={() => handleOpenEdit(rest)}
                          title="Edit restaurant"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn btn-outline btn-icon"
                          style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                          onClick={() => handleDelete(rest._id, rest.name)}
                          title="Delete restaurant"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Restaurant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}
        maxWidth="640px"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingRestaurant ? 'Update Details' : 'Create Restaurant'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cuisine (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                placeholder="Italian, Pizza, Pastas"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Physical Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Delivery Time</label>
              <input
                type="text"
                className="form-control"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Delivery Fee (₹)</label>
              <input
                type="number"
                step="1"
                className="form-control"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Min Order (₹)</label>
              <input
                type="number"
                step="1"
                className="form-control"
                value={formData.minOrder}
                onChange={(e) => setFormData({ ...formData, minOrder: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Banner Image URL</label>
            <input
              type="text"
              className="form-control"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRestaurantsPage;
