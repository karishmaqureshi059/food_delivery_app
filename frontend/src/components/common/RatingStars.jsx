import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, max = 5, onRate = null, size = 18, color = '#f59e0b' }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      {Array.from({ length: max }, (_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onRate && onRate(starNumber)}
            disabled={!onRate}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: onRate ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              color: isFilled ? color : '#cbd5e1'
            }}
          >
            <Star
              size={size}
              fill={isFilled ? color : 'none'}
              stroke={isFilled ? color : '#cbd5e1'}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
