import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, ShieldCheck, Clock, Award, Sparkles } from 'lucide-react';
import api from '../../services/api';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, catRes] = await Promise.all([
          api.get('/restaurants'),
          api.get('/categories')
        ]);
        if (restRes.success) setRestaurants(restRes.restaurants?.slice(0, 6) || []);
        if (catRes.success) setCategories(catRes.categories || []);
      } catch (err) {
        console.error('Landing page data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          padding: '5rem 0 6rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 86, 33, 0.15)',
                color: '#ff7a45',
                padding: '0.35rem 0.95rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                border: '1px solid rgba(255, 86, 33, 0.3)'
              }}
            >
              <Sparkles size={15} /> 50% OFF YOUR FIRST ORDER WITH CODE: WELCOME50
            </div>

            <h1 style={{ color: '#fff', fontSize: '3.2rem', marginBottom: '1.25rem', lineHeight: 1.15 }}>
              Craving Delicious Food? <br />
              <span style={{ color: 'var(--primary)' }}>Delivered to Your Door.</span>
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
              Order from top chef restaurants, cloud kitchens, and gourmet street food hubs with ultra-fast live tracking.
            </p>

            {/* Hero Search Box */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                maxWidth: '560px',
                margin: '0 auto'
              }}
            >
              <div style={{ padding: '0 0.85rem', display: 'flex', alignItems: 'center', color: '#ff5621' }}>
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Search pizza, biryani, burgers or restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  padding: '0.75rem 0',
                  color: '#0f172a'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', borderRadius: '12px' }}>
                Find Food
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', color: '#94a3b8', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="#ff7a45" /> 30-min guaranteed
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={16} color="#10b981" /> Hygienic & Sealed
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Award size={16} color="#f59e0b" /> Top-Rated Menus
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="section-spacer" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Explore Cuisines
              </span>
              <h2>What are you craving today?</h2>
            </div>
            <Link to="/restaurants" style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-strip">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="category-card"
                onClick={() => navigate(`/restaurants?category=${encodeURIComponent(cat.name)}`)}
              >
                <div className="category-icon-box">{cat.icon || '🍽️'}</div>
                <div className="category-title">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="section-spacer">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Handpicked Places
              </span>
              <h2>Popular Restaurants in New York</h2>
            </div>
            <Link to="/restaurants" className="btn btn-outline-primary btn-sm">
              Explore All Restaurants
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Fetching top restaurants..." />
          ) : (
            <div className="grid-restaurants">
              {restaurants.map((rest) => (
                <RestaurantCard key={rest._id} restaurant={rest} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacer" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Simple 4-Step Ordering
            </span>
            <h2>How FoodExpress Works</h2>
            <p>From cravings to hot delivery at your doorstep in under 35 minutes.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: '01', icon: '📍', title: 'Set Delivery Location', desc: 'Pin your home, workplace, or hotel location.' },
              { step: '02', icon: '🍔', title: 'Choose Your Food', desc: 'Browse hundreds of menu dishes and customize sizes.' },
              { step: '03', icon: '💳', title: 'Pay Securely', desc: 'Quick checkout with Cards, UPI, or Cash on Delivery.' },
              { step: '04', icon: '🛵', title: 'Live Order Tracking', desc: 'Watch your delivery rider on the live timeline.' }
            ].map((step, idx) => (
              <div
                key={idx}
                className="card"
                style={{ padding: '1.75rem', textAlign: 'center', border: '1px solid var(--border)' }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.5rem' }}>
                  STEP {step.step}
                </div>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{step.icon}</div>
                <h4 style={{ marginBottom: '0.5rem' }}>{step.title}</h4>
                <p style={{ fontSize: '0.85rem' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="section-spacer" style={{ background: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #ff642f 0%, #e64512 100%)',
              borderRadius: '24px',
              padding: '3rem 2.5rem',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <div style={{ maxWidth: '520px' }}>
              <h2 style={{ color: '#fff', fontSize: '2.2rem', marginBottom: '0.75rem' }}>
                Join FoodExpress Today
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Create an account now to unlock exclusive coupons, save your delivery addresses, and enjoy live order tracking!
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn btn-secondary btn-lg" style={{ background: '#0f172a', color: '#fff' }}>
                Create Free Account
              </Link>
              <Link to="/restaurants" className="btn btn-outline" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: '#fff' }}>
                Browse Food Menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
