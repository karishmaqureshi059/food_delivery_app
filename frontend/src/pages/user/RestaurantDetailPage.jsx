import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Bike, MapPin, Phone, Info, MessageSquare, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import FoodCard from '../../components/restaurant/FoodCard';
import ReviewCard from '../../components/restaurant/ReviewCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import RatingStars from '../../components/common/RatingStars';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { addToast } = useNotification();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [menuByCategory, setMenuByCategory] = useState({});
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'reviews'
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      try {
        const [resData, reviewsData] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/reviews/restaurant/${id}`)
        ]);

        if (resData.success) {
          setRestaurant(resData.restaurant);
          setFoods(resData.foods || []);
          setMenuByCategory(resData.menuByCategory || {});
          const firstCat = Object.keys(resData.menuByCategory || {})[0] || '';
          setActiveCategory(firstCat);
        }

        if (reviewsData.success) {
          setReviews(reviewsData.reviews || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetail();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      addToast('Please login to leave a review', 'warning');
      return;
    }
    if (!newComment.trim()) {
      addToast('Please enter your review comment', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      const data = await api.post('/reviews', {
        restaurantId: restaurant._id,
        rating: newRating,
        review: newComment.trim()
      });

      if (data.success) {
        setReviews([data.review, ...reviews]);
        setNewComment('');
        setNewRating(5);
        addToast('Review submitted successfully!', 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading restaurant menu..." />;
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <h2>Restaurant Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>The requested dining establishment is unavailable.</p>
        <Link to="/restaurants" className="btn btn-primary">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  const categoriesList = Object.keys(menuByCategory);

  return (
    <div>
      {/* Cover Banner */}
      <div
        style={{
          height: '240px',
          backgroundImage: `url(${restaurant.coverImage || restaurant.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 100%)' }} />
      </div>

      <div className="container" style={{ transform: 'translateY(-60px)', position: 'relative', zIndex: 10 }}>
        {/* Restaurant Header Card */}
        <div
          className="card"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: '#fff',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2.2rem' }}>{restaurant.name}</h1>
                <span className="rating-pill" style={{ fontSize: '0.9rem', padding: '0.25rem 0.65rem' }}>
                  <Star size={14} fill="#fff" stroke="#fff" />
                  {restaurant.rating?.toFixed(1)}
                </span>
              </div>

              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' • ') : restaurant.cuisine}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem' }}>
                <MapPin size={15} color="#ff5621" />
                <span>{restaurant.address}</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                borderLeft: '1px solid var(--border)',
                paddingLeft: '1.5rem',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>DELIVERY TIME</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#0f172a' }}>
                  <Clock size={16} color="#ff5621" /> {restaurant.deliveryTime}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>DELIVERY FEE</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                  {restaurant.deliveryFee === 0 ? 'FREE' : formatCurrency(restaurant.deliveryFee)}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>MIN ORDER</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                  {formatCurrency(restaurant.minOrder)}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', marginTop: '1.5rem', paddingTop: '1.25rem' }}>
            <button
              className={`btn btn-sm ${activeTab === 'menu' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu Catalog ({foods.length})
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'reviews' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab('reviews')}
            >
              <MessageSquare size={14} /> Reviews ({reviews.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Menu Items */}
        {activeTab === 'menu' && (
          <div>
            {/* Category Sub-tabs */}
            {categoriesList.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  overflowX: 'auto',
                  paddingBottom: '1rem',
                  marginBottom: '1.5rem',
                  position: 'sticky',
                  top: '4.5rem',
                  zIndex: 20,
                  background: 'var(--bg-main)'
                }}
              >
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-sm ${activeCategory === cat ? 'btn-secondary' : 'btn-outline'}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat} ({menuByCategory[cat]?.length})
                  </button>
                ))}
              </div>
            )}

            {/* Dishes by Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {categoriesList
                .filter((cat) => !activeCategory || cat === activeCategory)
                .map((category) => (
                  <div key={category}>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #e2e8f0' }}>
                      {category}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                      {menuByCategory[category]?.map((food) => (
                        <FoodCard key={food._id} food={food} restaurant={restaurant} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
            {/* Reviews List */}
            <div>
              <h3 style={{ marginBottom: '1.25rem' }}>Customer Ratings & Feedback</h3>
              {reviews.length === 0 ? (
                <p style={{ color: '#64748b' }}>No reviews yet. Be the first to review this restaurant!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map((rev) => (
                    <ReviewCard key={rev._id} review={rev} />
                  ))}
                </div>
              )}
            </div>

            {/* Leave a Review Box */}
            <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h4 style={{ marginBottom: '1rem' }}>Leave a Review</h4>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <RatingStars rating={newRating} onRate={setNewRating} size={24} />
                </div>

                <div className="form-group">
                  <label className="form-label">Review Comment</label>
                  <textarea
                    className="form-control"
                    placeholder="Share your experience regarding food quality, packaging, and delivery..."
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Posting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
