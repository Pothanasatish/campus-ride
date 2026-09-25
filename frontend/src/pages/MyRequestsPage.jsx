import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ReviewModal from '../components/domain/ReviewModal';
import { Clock, CheckCircle2, XCircle, Star, ChevronRight } from 'lucide-react';

const MyRequestsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalData, setReviewModalData] = useState(null);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get('/requests/my-requests');
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('[MyRequests Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this ride request?')) return;

    try {
      const res = await API.put(`/requests/${requestId}/cancel`);
      if (res.success) {
        fetchMyRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel request.');
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'pending') return req.status === 'pending';
    if (activeTab === 'accepted') return req.status === 'accepted';
    if (activeTab === 'history') return req.status === 'rejected' || req.status === 'cancelled';
    return true;
  });

  return (
    <div className="my-requests-page">
      <div className="page-header">
        <h1 className="heading-xl">My Commute Requests</h1>
        <p className="text-sub">Track the status of your requested seats and review completed rides</p>
      </div>

      {/* Tabs */}
      <div className="tabs-header">
        <button
          onClick={() => setActiveTab('pending')}
          className={`tab-button ${activeTab === 'pending' ? 'tab-active' : ''}`}
        >
          Pending ({requests.filter((r) => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`tab-button ${activeTab === 'accepted' ? 'tab-active' : ''}`}
        >
          Accepted ({requests.filter((r) => r.status === 'accepted').length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`tab-button ${activeTab === 'history' ? 'tab-active' : ''}`}
        >
          History ({requests.filter((r) => r.status === 'rejected' || r.status === 'cancelled').length})
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="loading-spinner">Loading requests...</div>
      ) : filteredRequests.length > 0 ? (
        <div className="requests-list">
          {filteredRequests.map((req) => (
            <div key={req._id} className="request-card">
              <div className="request-info">
                <div className="status-badge-row">
                  <span className={`badge badge-${req.status === 'accepted' ? 'success' : req.status === 'pending' ? 'warning' : 'danger'}`}>
                    {req.status}
                  </span>
                  <span className="req-date">
                    Requested on {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="heading-md" style={{ margin: '0.5rem 0 0.25rem 0' }}>
                  {req.ride?.source} → {req.ride?.destination}
                </h3>
                <p className="text-sub">
                  Provider: <strong>{req.ride?.driver?.name}</strong> • Departure: {req.ride?.departureTime} • {req.seatsRequested} Seat(s)
                </p>

                {req.ride?.driver?.phone && req.status === 'accepted' && (
                  <div className="contact-reveal">
                    Contact Phone: <strong>{req.ride.driver.phone}</strong>
                  </div>
                )}
              </div>

              <div className="request-actions">
                {req.status === 'pending' && (
                  <button onClick={() => handleCancelRequest(req._id)} className="btn btn-danger btn-sm">
                    Cancel Request
                  </button>
                )}

                {req.status === 'accepted' && (
                  <>
                    <button
                      onClick={() =>
                        setReviewModalData({
                          reviewedUser: req.ride?.driver,
                          rideId: req.ride?._id,
                        })
                      }
                      className="btn btn-primary btn-sm"
                    >
                      <Star size={14} /> Rate Driver
                    </button>
                    <button onClick={() => handleCancelRequest(req._id)} className="btn btn-secondary btn-sm">
                      Cancel Reservation
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <Clock size={36} color="var(--text-muted)" />
          <h3>No {activeTab} Requests</h3>
          <p>You have no commute requests in this tab.</p>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalData && (
        <ReviewModal
          reviewedUser={reviewModalData.reviewedUser}
          rideId={reviewModalData.rideId}
          onClose={() => setReviewModalData(null)}
          onSuccess={() => alert('Rating & review submitted successfully!')}
        />
      )}

      <style>{`
        .my-requests-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .tabs-header {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--bg-card-border);
          padding-bottom: 0.5rem;
        }
        .tab-button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .tab-active {
          background: var(--bg-surface);
          color: var(--primary);
        }
        .requests-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .request-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .status-badge-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .req-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .contact-reveal {
          margin-top: 0.5rem;
          padding: 0.4rem 0.75rem;
          background: var(--primary-light);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: var(--primary);
          display: inline-block;
        }
        .request-actions {
          display: flex;
          gap: 0.65rem;
        }
        .empty-state-card {
          text-align: center;
          padding: 4rem 1.5rem;
          background: var(--bg-surface);
          border: 1px dashed var(--bg-card-border);
          border-radius: var(--radius-lg);
        }
      `}</style>
    </div>
  );
};

export default MyRequestsPage;
