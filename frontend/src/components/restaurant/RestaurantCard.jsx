import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Bike, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';
import api from '../../services/api';

const RestaurantCard = ({ restaurant }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useNotification();
  const [isFav, setIsFav] = useState(() => {
    return user?.favorites?.includes(restaurant._id) || false;
  });

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      addToast('Please login to save favorites', 'warning');
      return;
    }

    try {
      const data = await api.post(`/users/favorites/${restaurant._id}`);
      if (data.success) {
        setIsFav(!isFav);
        addToast(
          !isFav ? `Added "${restaurant.name}" to favorites` : `Removed "${restaurant.name}" from favorites`,
          'info'
        );
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <Link to={`/restaurant/${restaurant._id}`} className="restaurant-card">
      <div className="restaurant-img-wrapper">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500'}
          alt={restaurant.name}
          className="restaurant-img"
          loading="lazy"
        />

        <div className="restaurant-badge-time">
          <Clock size={12} />
          <span>{restaurant.deliveryTime || '25-35 min'}</span>
        </div>

        {/* Favorite heart button */}
        <button
          onClick={handleFavoriteClick}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={16}
            color={isFav ? '#ef4444' : '#64748b'}
            fill={isFav ? '#ef4444' : 'none'}
          />
        </button>
      </div>

      <div className="restaurant-info">
        <div className="restaurant-title-row">
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <span className="rating-pill">
            <Star size={12} fill="#fff" stroke="#fff" />
            {restaurant.rating?.toFixed(1) || '4.5'}
          </span>
        </div>

        <p className="restaurant-cuisine">
          {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' • ') : restaurant.cuisine}
        </p>

        <div className="restaurant-meta-row">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Bike size={14} color="#ff5621" />
            {restaurant.deliveryFee === 0 ? 'FREE' : `${formatCurrency(restaurant.deliveryFee)} delivery`}
          </span>
          <span>Min {formatCurrency(restaurant.minOrder || 100)}</span>
          <span style={{ fontWeight: 600 }}>{restaurant.priceRange ? restaurant.priceRange.replace(/\$/g, '₹') : '₹₹'}</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
