import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
  Percent,
  Clock,
  Flame,
  Award
} from 'lucide-react';
import api from '../../services/api';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import FoodCard from '../../components/restaurant/FoodCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';

const HomePage = () => {
  const { user, selectedLocation } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularFoods, setPopularFoods] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [restRes, catRes, foodRes, couponRes] = await Promise.all([
          api.get('/restaurants'),
          api.get('/categories'),
          api.get('/food?isPopular=true'),
          api.get('/coupons/active')
        ]);

        if (restRes.success) setRestaurants(restRes.restaurants || []);
        if (catRes.success) setCategories(catRes.categories || []);
        if (foodRes.success) setPopularFoods(foodRes.foods?.slice(0, 6) || []);
        if (couponRes.success) setCoupons(couponRes.coupons || []);

        // If authenticated, also fetch recent orders
        const token = localStorage.getItem('foodexpress_token');
        if (token) {
          try {
            const ordersRes = await api.get('/orders/my-orders');
            if (ordersRes.success) {
              setRecentOrders(ordersRes.orders?.slice(0, 3) || []);
            }
          } catch (err) {
            // ignore
          }
        }
      } catch (err) {
        console.error('Home page load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Preparing your gourmet menu..." />;
  }

  return (
    <div className="container" style={{ paddingBottom: '4rem' }}>
      {/* Top Welcome Bar & Delivery Location */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.5rem 0 1rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>DELIVERING TO</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
            <MapPin size={18} color="var(--primary)" />
            <span>{selectedLocation}</span>
          </div>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Welcome back, <strong style={{ color: '#0f172a' }}>{user.name.split(' ')[0]}</strong>!
            </span>
          </div>
        )}
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} style={{ margin: '1rem 0 2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#fff',
            borderRadius: '16px',
            border: '1.5px solid var(--border)',
            padding: '0.35rem 1rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Search size={20} color="#64748b" style={{ marginRight: '0.75rem' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search for restaurants, burgers, pizza, salads, or desserts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', boxShadow: 'none', padding: '0.65rem 0' }}
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: '10px' }}>
            Search
          </button>
        </div>
      </form>

      {/* Food Categories Strip */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Explore Categories</h3>
          <Link to="/restaurants" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 700 }}>
            See All
          </Link>
        </div>

        <div className="category-strip">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="category-card"
              onClick={() => navigate(`/restaurants?category=${encodeURIComponent(cat.name)}`)}
            >
              <div className="category-icon-box">{cat.icon}</div>
              <div className="category-title">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Offers and Discounts Carousel/Cards */}
      {coupons.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={20} color="#f59e0b" />
            <h3>Offers & Discounts for You</h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                style={{
                  background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  border: '1px dashed #fdba74',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#ff5621', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 800, fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    <Tag size={12} /> {coupon.code}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                    {coupon.description}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    Min order {formatCurrency(coupon.minOrder)} • Up to {formatCurrency(coupon.maxDiscount)} OFF
                  </div>
                </div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  style={{ background: '#fff' }}
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    alert(`Copied coupon code ${coupon.code}! Paste it in your cart at checkout.`);
                  }}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Ordered Items (if user has orders) */}
      {recentOrders.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="#ff5621" />
              <h3>Order Again</h3>
            </div>
            <Link to="/orders" style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 700 }}>
              All Orders
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {recentOrders.map((order) => (
              <div key={order._id} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{order.restaurantId?.name}</span>
                  <span className={`badge ${order.orderStatus === 'Delivered' ? 'badge-success' : 'badge-primary'}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  {order.items?.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800 }}>{formatCurrency(order.total)}</span>
                  <Link to={`/restaurant/${order.restaurantId?._id}`} className="btn btn-primary btn-sm">
                    Reorder
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Restaurants */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3>Popular Restaurants</h3>
            <p style={{ fontSize: '0.875rem' }}>Top picks delivering around {selectedLocation}</p>
          </div>
          <Link to="/restaurants" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>
            View All ({restaurants.length})
          </Link>
        </div>

        <div className="grid-restaurants">
          {restaurants.map((rest) => (
            <RestaurantCard key={rest._id} restaurant={rest} />
          ))}
        </div>
      </section>

      {/* Recommended Food Dishes */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Flame size={20} color="#ff5621" />
          <h3>Recommended Dishes</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {popularFoods.map((food) => (
            <FoodCard key={food._id} food={food} restaurant={food.restaurantId} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
