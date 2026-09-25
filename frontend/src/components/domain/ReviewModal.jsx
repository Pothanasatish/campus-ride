import React, { useState } from 'react';
import { X, Star, AlertCircle } from 'lucide-react';
import API from '../../services/api';

const ReviewModal = ({ reviewedUser, rideId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!reviewedUser || !rideId) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/reviews', {
        reviewedUserId: reviewedUser._id,
        rideId,
        rating,
        comment,
      });

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div>
            <h3 className="heading-md">Rate Commute Experience</h3>
            <p className="text-sub">Reviewing {reviewedUser.name}</p>
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
            <label className="form-label">Rating Stars</label>
            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="star-btn"
                >
                  <Star
                    size={28}
                    fill={star <= rating ? '#f59e0b' : 'none'}
                    color={star <= rating ? '#f59e0b' : 'var(--text-muted)'}
                  />
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
              {rating} Out of 5 Stars
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Review Comment (Optional)</label>
            <textarea
              rows={3}
              placeholder="Punctual, friendly commute partner. Highly recommended!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 440px;
          padding: 1.5rem;
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--bg-card-border);
          padding-bottom: 0.75rem;
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .error-banner {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .star-picker {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }
        .star-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .star-btn:hover {
          transform: scale(1.15);
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default ReviewModal;
