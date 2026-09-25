import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import RatingStars from '../components/domain/RatingStars';
import { Car, Clock, CheckCircle2, XCircle, Users, ChevronRight, PlusCircle } from 'lucide-react';

const MyRidesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [myRides, setMyRides] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchMyRidesData();
  }, []);

  const fetchMyRidesData = async () => {
    setLoading(true);
    try {
      // 1. Fetch rides created by user
      const ridesRes = await API.get('/rides?myRidesOnly=true');
      if (ridesRes.success) {
        setMyRides(ridesRes.data);
      }

      // 2. Fetch incoming requests
      const reqRes = await API.get('/requests/incoming');
      if (reqRes.success) {
        setIncomingRequests(reqRes.data);
      }
    } catch (err) {
      console.error('[MyRides Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setProcessingId(requestId);
    try {
      const res = await API.put(`/requests/${requestId}/accept`);
      if (res.success) {
        alert('Request accepted successfully! Seat reserved.');
        fetchMyRidesData();
      }
    } catch (err) {
      alert(err.message || 'Failed to accept request.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setProcessingId(requestId);
    try {
      const res = await API.put(`/requests/${requestId}/reject`);
      if (res.success) {
        fetchMyRidesData();
      }
    } catch (err) {
      alert(err.message || 'Failed to reject request.');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredRides = myRides.filter((ride) => {
    if (activeTab === 'active') return ride.status === 'active' || ride.status === 'full';
    if (activeTab === 'completed') return ride.status === 'completed';
    if (activeTab === 'cancelled') return ride.status === 'cancelled';
    return true;
  });

  const pendingIncomingRequests = incomingRequests.filter((r) => r.status === 'pending');

  return (
    <div className="my-rides-page">
      <div className="page-header">
        <div>
          <h1 className="heading-xl">My Offered Commutes</h1>
          <p className="text-sub">Manage your recurring ride schedules and passenger booking requests</p>
        </div>
        <button onClick={() => navigate('/rides/create')} className="btn btn-primary">
          <PlusCircle size={18} /> Offer New Commute
        </button>
      </div>

      {/* Incoming Requests Alert Banner */}
      {pendingIncomingRequests.length > 0 && (
        <div className="requests-alert-banner animate-fade">
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              You have {pendingIncomingRequests.length} pending seat request(s)!
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Review student profiles and reserve available seats.
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-header">
        <button
          onClick={() => setActiveTab('active')}
          className={`tab-button ${activeTab === 'active' ? 'tab-active' : ''}`}
        >
          Active Commutes ({myRides.filter((r) => r.status === 'active' || r.status === 'full').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`tab-button ${activeTab === 'completed' ? 'tab-active' : ''}`}
        >
          Completed ({myRides.filter((r) => r.status === 'completed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`tab-button ${activeTab === 'cancelled' ? 'tab-active' : ''}`}
        >
          Cancelled ({myRides.filter((r) => r.status === 'cancelled').length})
        </button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="loading-spinner">Loading offered commutes...</div>
      ) : filteredRides.length > 0 ? (
        <div className="rides-list-container">
          {filteredRides.map((ride) => {
            const rideRequests = incomingRequests.filter((req) => req.ride?._id === ride._id);
            return (
              <div key={ride._id} className="my-ride-card">
                <div className="ride-card-main">
                  <div>
                    <div className="ride-status-row">
                      <span className={`badge badge-${ride.status === 'active' ? 'success' : ride.status === 'full' ? 'warning' : 'info'}`}>
                        {ride.status}
                      </span>
                      <span className="seats-count-chip">
                        {ride.availableSeats} of {ride.totalSeats} seats available
                      </span>
                    </div>

                    <h3 className="heading-md" style={{ margin: '0.5rem 0 0.25rem 0' }}>
                      {ride.source} → {ride.destination}
                    </h3>
                    <p className="text-sub">
                      Departure: {ride.departureTime} • {ride.vehicleType} ({ride.vehicleModel || 'Standard'})
                    </p>
                  </div>

                  <button onClick={() => navigate(`/rides/${ride._id}`)} className="btn btn-secondary btn-sm">
                    View Details <ChevronRight size={14} />
                  </button>
                </div>

                {/* Ride Requests Sub-section */}
                {rideRequests.length > 0 && (
                  <div className="requests-sub-box">
                    <h4 className="sub-box-title">Passenger Requests ({rideRequests.length})</h4>
                    <div className="req-items-list">
                      {rideRequests.map((req) => (
                        <div key={req._id} className="req-item">
                          <div className="req-user">
                            <div className="user-avatar">{req.requester?.name?.charAt(0)}</div>
                            <div>
                              <span className="user-name">{req.requester?.name}</span>
                              <span className="user-meta">
                                {req.requester?.branch} ({req.requester?.year}) • Requested {req.seatsRequested} seat(s)
                              </span>
                              {req.message && <div className="req-msg">"{req.message}"</div>}
                            </div>
                          </div>

                          <div className="req-actions">
                            {req.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleAcceptRequest(req._id)}
                                  disabled={processingId === req._id || ride.availableSeats < req.seatsRequested}
                                  className="btn btn-primary btn-sm"
                                >
                                  Accept & Reserve
                                </button>
                                <button
                                  onClick={() => handleRejectRequest(req._id)}
                                  disabled={processingId === req._id}
                                  className="btn btn-danger btn-sm"
                                >
                                  Decline
                                </button>
                              </>
                            ) : (
                              <span className={`badge badge-${req.status === 'accepted' ? 'success' : 'danger'}`}>
                                {req.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state-card">
          <Car size={36} color="var(--text-muted)" />
          <h3>No {activeTab} Offered Rides</h3>
          <p>You have not created any {activeTab} commute offers.</p>
        </div>
      )}

      <style>{`
        .my-rides-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .requests-alert-banner {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          color: var(--primary);
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
        .rides-list-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .my-ride-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .ride-card-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .ride-status-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .seats-count-chip {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .requests-sub-box {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-md);
          padding: 1rem;
        }
        .sub-box-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }
        .req-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .req-item {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .req-user {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-name {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
          display: block;
        }
        .user-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: block;
        }
        .req-msg {
          font-size: 0.78rem;
          color: var(--primary);
          font-style: italic;
          margin-top: 2px;
        }
        .req-actions {
          display: flex;
          gap: 0.5rem;
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

export default MyRidesPage;
