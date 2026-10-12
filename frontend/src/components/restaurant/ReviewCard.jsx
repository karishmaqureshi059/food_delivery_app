import React from 'react';
import RatingStars from '../common/RatingStars';
import { formatDate } from '../../utils/formatters';

const ReviewCard = ({ review }) => {
  return (
    <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img
            src={review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
            alt={review.userName}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{review.userName}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatDate(review.createdAt)}</div>
          </div>
        </div>

        <RatingStars rating={review.rating} size={15} />
      </div>

      <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.5 }}>
        "{review.review}"
      </p>

      {(review.foodRating || review.deliveryRating) && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.65rem', fontSize: '0.75rem', color: '#64748b' }}>
          {review.foodRating && <span>Food: {review.foodRating}★</span>}
          {review.deliveryRating && <span>Delivery: {review.deliveryRating}★</span>}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
