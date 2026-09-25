import React, { useState } from 'react';
import { X, ShieldAlert, AlertCircle } from 'lucide-react';
import API from '../../services/api';

const ReportModal = ({ reportedUser, rideId, onClose, onSuccess }) => {
  const [reason, setReason] = useState('Inappropriate Behavior');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!reportedUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await API.post('/reports', {
        reportedUserId: reportedUser._id,
        rideId: rideId || null,
        reason,
        description,
      });

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade">
        <div className="modal-header">
          <div>
            <h3 className="heading-md" style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={18} /> Report User
            </h3>
            <p className="text-sub">Filing confidential safety report for {reportedUser.name}</p>
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
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Primary Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="form-select"
            >
              <option value="Inappropriate Behavior">Inappropriate / Unprofessional Conduct</option>
              <option value="Unsafe Driving">Unsafe Driving / Riding</option>
              <option value="Repeated Cancellation">Repeated Last-Minute Cancellations</option>
              <option value="Fake Profile">Fake Profile / Misleading Information</option>
              <option value="Harassment">Harassment or Spam</option>
              <option value="Other">Other Safety Issue</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Explanation</label>
            <textarea
              rows={4}
              required
              placeholder="Please describe what happened so our moderation team can inspect immediately..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-danger">
              {loading ? 'Submitting...' : 'Submit Report'}
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
          max-width: 460px;
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

export default ReportModal;
