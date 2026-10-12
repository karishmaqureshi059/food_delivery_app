import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Clock, SlidersHorizontal, RotateCcw } from 'lucide-react';
import api from '../../services/api';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minRating, setMinRating] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set('search', search);
      if (selectedCategory) queryParams.set('category', selectedCategory);
      if (minRating) queryParams.set('rating', minRating);
      if (priceRange) queryParams.set('priceRange', priceRange);
      if (vegOnly) queryParams.set('vegOnly', 'true');
      if (sortBy) queryParams.set('sort', sortBy);

      const res = await api.get(`/restaurants?${queryParams.toString()}`);
      if (res.success) {
        setRestaurants(res.restaurants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      const res = await api.get('/categories');
      if (res.success) setCategories(res.categories || []);
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [selectedCategory, minRating, priceRange, vegOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinRating('');
    setPriceRange('');
    setVegOnly(false);
    setSortBy('popularity');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Title & Search Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Explore Restaurants & Menus</h2>
        <p style={{ marginTop: '0.25rem' }}>Find your favorite cuisine with custom filters and real-time availability.</p>
      </div>

      {/* Search and Sort Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          background: '#fff',
          padding: '1rem',
          borderRadius: '16px',
          border: '1px solid var(--border)'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flex: 1, minWidth: '260px', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by restaurant name, cuisine or dish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
            Sort By:
          </label>
          <select
            className="form-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <option value="popularity">Popularity (Most Reviews)</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="deliveryTime">Delivery Time (Fastest)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.65rem',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <SlidersHorizontal size={14} /> FILTERS:
        </span>

        {/* Veg Only Toggle */}
        <button
          className={`btn btn-sm ${vegOnly ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setVegOnly(!vegOnly)}
        >
          🌱 Pure Veg Only
        </button>

        {/* Rating 4.0+ */}
        <button
          className={`btn btn-sm ${minRating === '4.0' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMinRating(minRating === '4.0' ? '' : '4.0')}
        >
          ★ 4.0+ Rating
        </button>

        {/* Rating 4.5+ */}
        <button
          className={`btn btn-sm ${minRating === '4.5' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setMinRating(minRating === '4.5' ? '' : '4.5')}
        >
          ★ 4.5+ Top Rated
        </button>

        {/* Price Ranges */}
        {['₹', '₹₹', '₹₹₹'].map((pr) => (
          <button
            key={pr}
            className={`btn btn-sm ${priceRange === pr ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPriceRange(priceRange === pr ? '' : pr)}
          >
            {pr}
          </button>
        ))}

        {/* Categories Selector */}
        {categories.map((cat) => (
          <button
            key={cat._id}
            className={`btn btn-sm ${selectedCategory === cat.name ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}

        {/* Reset */}
        {(search || selectedCategory || minRating || priceRange || vegOnly || sortBy !== 'popularity') && (
          <button
            className="btn btn-outline btn-sm"
            onClick={handleResetFilters}
            style={{ color: '#ef4444', borderColor: '#fca5a5' }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>

      {/* Results View */}
      {loading ? (
        <LoadingSpinner message="Filtering restaurants..." />
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No restaurants match your search"
          description="Try broadening your filters or checking a different cuisine."
          action={
            <button className="btn btn-primary" onClick={handleResetFilters}>
              Clear All Filters
            </button>
          }
        />
      ) : (
        <div>
          <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Found <strong>{restaurants.length}</strong> restaurants
          </div>
          <div className="grid-restaurants">
            {restaurants.map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
