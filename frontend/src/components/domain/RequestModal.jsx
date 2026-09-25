import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import API from '../../services/api';

const RequestModal = ({ ride, onClose, onSuccess }) => {
  const [seatsRequested, setSeatsRequested] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!ride) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post(`/requests/ride/${ride._id}`, {
        seatsRequested,
        message,
      });

      if (res.success) {
        if (onSuccess) onSuccess(res.data);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to send ride request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div>
            <h3 className="heading-md">Request Commute Seat</h3>
            <p className="text-sub">
              {ride.source} → {ride.destination} ({ride.departureTime})
            </p>
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

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Number of Seats Required</label>
            <select
              value={seatsRequested}
              onChange={(e) => setSeatsRequested(Number(e.target.value))}
              className="form-select"
            >
              {Array.from({ length: ride.availableSeats || 1 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} Seat{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Optional Message for Driver</label>
            <textarea
              rows={3}
              placeholder="e.g. Hi! I will be waiting at the Town Hall junction at 8:05 AM."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Send size={16} />
              {loading ? 'Sending Request...' : 'Send Request'}
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
          max-width: 480px;
          padding: 1.5rem;
          box-shadow: var(--shadow-lg);
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--bg-card-border);
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }
        .error-banner {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
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

export default RequestModal;
