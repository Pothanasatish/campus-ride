import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, totalRatings = 0, size = 14 }) => {
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      <Star size={size} fill="#f59e0b" color="#f59e0b" />
      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {rounded}
      </span>
      {totalRatings > 0 && (
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          ({totalRatings})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
