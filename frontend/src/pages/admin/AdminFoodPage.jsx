import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, UtensilsCrossed, Search, Filter } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';

const AdminFoodPage = () => {
  const { addToast } = useNotification();

  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedRestId, setSelectedRestId] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 249,
    restaurantId: '',
    category: 'Pizza',
    isVeg: true,
    image: '',
    isPopular: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (selectedRestId) queryParams.set('restaurantId', selectedRestId);
      if (selectedCat) queryParams.set('category', selectedCat);

      const [foodRes, restRes, catRes] = await Promise.all([
        api.get(`/food?${queryParams.toString()}`),
        api.get('/restaurants/admin/all'),
        api.get('/categories')
      ]);

      if (foodRes.success) setFoods(foodRes.foods || []);
      if (restRes.success) setRestaurants(restRes.restaurants || []);
      if (catRes.success) setCategories(catRes.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRestId, selectedCat]);

  const handleOpenAdd = () => {
    setEditingFood(null);
    setFormData({
      name: '',
      description: '',
      price: 249,
      restaurantId: restaurants[0]?._id || '',
      category: categories[0]?.name || 'Pizza',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      isPopular: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      restaurantId: food.restaurantId?._id || food.restaurantId,
      category: food.category,
      isVeg: food.isVeg,
      image: food.image,
      isPopular: food.isPopular
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        const res = await api.put(`/food/${editingFood._id}`, formData);
        if (res.success) {
          addToast('Food item updated', 'success');
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await api.post('/food', formData);
        if (res.success) {
          addToast('New food item added to menu', 'success');
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleStock = async (id) => {
    try {
      const res = await api.put(`/food/${id}/toggle-stock`);
      if (res.success) {
        addToast(res.message, 'info');
        fetchData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from menu?`)) return;
    try {
      const res = await api.delete(`/food/${id}`);
      if (res.success) {
        addToast('Food item deleted', 'success');
        fetchData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Manage Menu & Food Items</h2>
          <p style={{ marginTop: '0.2rem' }}>Catalog of dishes, pricing, inventory stock availability, and categories.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Food Item
        </button>
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
            placeholder="Search dish name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={selectedRestId}
          onChange={(e) => setSelectedRestId(e.target.value)}
        >
          <option value="">All Restaurants</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <button className="btn btn-outline" onClick={fetchData}>
          Filter
        </button>
      </div>

      {/* Food Items Table */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Fetching dishes catalog..." />
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Restaurant</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Diet</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food) => (
                  <tr key={food._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                          alt={food.name}
                          style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{food.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {food.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{food.restaurantId?.name || 'Restaurant'}</td>
                    <td>
                      <span className="badge badge-default" style={{ textTransform: 'none' }}>
                        {food.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800 }}>{formatCurrency(food.price)}</td>
                    <td>
                      <span className={`badge ${food.isVeg ? 'badge-success' : 'badge-danger'}`}>
                        {food.isVeg ? '🌱 Veg' : '🥩 Non-Veg'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${food.isAvailable ? 'btn-outline-primary' : 'btn-outline'}`}
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => handleToggleStock(food._id)}
                      >
                        {food.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn btn-outline btn-icon"
                          onClick={() => handleOpenEdit(food)}
                          title="Edit food"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn btn-outline btn-icon"
                          style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                          onClick={() => handleDelete(food._id, food.name)}
                          title="Delete food"
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

      {/* Add / Edit Food Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFood ? 'Edit Menu Item' : 'Add New Menu Item'}
        maxWidth="600px"
        footer={
          <>
            <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingFood ? 'Save Changes' : 'Add to Menu'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Dish Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Restaurant</label>
              <select
                className="form-control"
                value={formData.restaurantId}
                onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
                required
              >
                <option value="">Select Restaurant</option>
                {restaurants.map((r) => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input
              type="text"
              className="form-control"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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

          <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isVeg}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
              />
              <span>Vegetarian Dish</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              />
              <span>Mark as Bestseller ★</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFoodPage;
