import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/domain/RatingStars';
import RequestModal from '../components/domain/RequestModal';
import ReportModal from '../components/domain/ReportModal';
import API from '../services/api';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Car,
  Bike,
  ShieldCheck,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ShieldAlert,
} from 'lucide-react';

const RideDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rideData, setRideData] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/rides/${id}`);
      if (res.success) {
        setRideData(res.data.ride);
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      console.error('[RideDetail Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to update this ride status to '${newStatus}'?`)) return;
    setStatusUpdating(true);

    try {
      const res = await API.patch(`/rides/${id}/status`, { status: newStatus });
      if (res.success) {
        fetchRideDetails();
      }
    } catch (err) {
      alert(err.message || 'Status update failed.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading ride details...</div>;
  }

  if (!rideData) {
    return <div className="error-card">Ride offer not found.</div>;
  }

  const isDriver = rideData.driver?._id === user?._id;
  const acceptedPassengers = requests.filter((r) => r.status === 'accepted');

  return (
    <div className="ride-detail-page">
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm mb-3">
        <ArrowLeft size={16} /> Back to Search
      </button>

      <div className="detail-layout">
        {/* Main Ride Content */}
        <div className="detail-main">
          {/* Header Card */}
          <div className="main-card">
            <div className="card-top-row">
              <div>
                <span className={`badge badge-${rideData.status === 'active' ? 'success' : rideData.status === 'completed' ? 'info' : 'warning'}`}>
                  {rideData.status}
                </span>
                <h1 className="heading-xl" style={{ marginTop: '0.5rem' }}>
                  {rideData.source} → {rideData.destination}
                </h1>
              </div>

              {isDriver && (
                <div className="driver-controls">
                  <span className="control-label">Status Controls:</span>
                  {rideData.status !== 'completed' && rideData.status !== 'cancelled' && (
                    <>
                      <button
                        onClick={() => handleStatusChange('completed')}
                        disabled={statusUpdating}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle2 size={14} /> Mark Completed
                      </button>
                      <button
                        onClick={() => handleStatusChange('cancelled')}
                        disabled={statusUpdating}
                        className="btn btn-danger btn-sm"
                      >
                        <XCircle size={14} /> Cancel Ride
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Checkpoints */}
            {rideData.pickupPoints && rideData.pickupPoints.length > 0 && (
              <div className="checkpoints-box">
                <span className="checkpoints-label">Pickup Checkpoints:</span>
                <div className="checkpoint-tags">
                  {rideData.pickupPoints.map((pt, i) => (
                    <span key={i} className="checkpoint-chip">
                      <MapPin size={12} color="#10b981" /> {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Specs Grid */}
            <div className="specs-grid">
              <div className="spec-box">
                <Clock size={18} color="#10b981" />
                <div>
                  <span className="spec-title">Departure Time</span>
                  <span className="spec-value">{rideData.departureTime}</span>
                </div>
              </div>

              {rideData.returnTime && (
                <div className="spec-box">
                  <Clock size={18} color="#3b82f6" />
                  <div>
                    <span className="spec-title">Return Time</span>
                    <span className="spec-value">{rideData.returnTime}</span>
                  </div>
                </div>
              )}

              <div className="spec-box">
                <Users size={18} color="#f59e0b" />
                <div>
                  <span className="spec-title">Seat Availability</span>
                  <span className="spec-value">{rideData.availableSeats} / {rideData.totalSeats} Available</span>
                </div>
              </div>

              <div className="spec-box">
                <Car size={18} color="#10b981" />
                <div>
                  <span className="spec-title">Vehicle Spec</span>
                  <span className="spec-value">{rideData.vehicleType} ({rideData.vehicleModel || 'Standard'})</span>
                </div>
              </div>
            </div>

            {/* Recurring Days */}
            <div className="days-box">
              <span className="spec-title">Weekly Schedule Days</span>
              <div className="day-pills-row">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <span key={d} className={`day-tag ${rideData.recurringDays?.includes(d) ? 'day-tag-active' : ''}`}>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {rideData.notes && (
              <div className="notes-box">
                <strong>Driver Notes:</strong> {rideData.notes}
              </div>
            )}
          </div>

          {/* Accepted Passengers Section */}
          <div className="main-card">
            <h3 className="heading-md" style={{ marginBottom: '1rem' }}>
              Accepted Commute Passengers ({acceptedPassengers.length})
            </h3>
            {acceptedPassengers.length > 0 ? (
              <div className="passengers-list">
                {acceptedPassengers.map((p) => (
                  <div key={p._id} className="passenger-row">
                    <div className="passenger-info">
                      <div className="p-avatar">{p.requester?.name?.charAt(0)}</div>
                      <div>
                        <div className="p-name">{p.requester?.name}</div>
                        <div className="p-meta">{p.requester?.branch} ({p.requester?.year})</div>
                      </div>
                    </div>
                    <RatingStars rating={p.requester?.rating} totalRatings={p.requester?.totalRatings} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sub">No accepted passengers for this commute yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar Driver Card */}
        <div className="detail-sidebar">
          <div className="driver-profile-card">
            <div className="driver-avatar-lg">
              {rideData.driver?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="heading-md">{rideData.driver?.name}</h3>
            <span className="college-sub">{rideData.driver?.college}</span>
            <div style={{ margin: '0.5rem 0' }}>
              <RatingStars rating={rideData.driver?.rating} totalRatings={rideData.driver?.totalRatings} size={16} />
            </div>
            <p className="driver-bio">{rideData.driver?.bio || 'Verified student commuter on CampusRide.'}</p>

            <div className="driver-contact-meta">
              <div className="contact-item"><Mail size={14} /> {rideData.driver?.email}</div>
              {rideData.driver?.phone && <div className="contact-item"><Phone size={14} /> {rideData.driver?.phone}</div>}
            </div>

            {!isDriver && (
              <div className="sidebar-actions">
                {rideData.availableSeats > 0 && rideData.status === 'active' ? (
                  <button onClick={() => setShowRequestModal(true)} className="btn btn-primary w-full">
                    Request Seat
                  </button>
                ) : (
                  <button disabled className="btn btn-secondary w-full">
                    {rideData.status === 'full' ? 'Seats Full' : 'Commute Unavailable'}
                  </button>
                )}

                <button
                  onClick={() => setShowReportModal(true)}
                  className="btn btn-secondary btn-sm w-full"
                  style={{ color: '#ef4444' }}
                >
                  <ShieldAlert size={14} /> Report User
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && (
        <RequestModal
          ride={rideData}
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            alert('Request submitted successfully!');
            fetchRideDetails();
          }}
        />
      )}

      {showReportModal && (
        <ReportModal
          reportedUser={rideData.driver}
          rideId={rideData._id}
          onClose={() => setShowReportModal(false)}
          onSuccess={() => alert('Report submitted confidentially to campus administration.')}
        />
      )}

      <style>{`
        .ride-detail-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .mb-3 { margin-bottom: 1rem; }
        .detail-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 1.5rem;
        }
        .detail-main {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .main-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
        }
        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .driver-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .control-label {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .checkpoints-box {
          margin: 1.25rem 0;
          padding: 0.85rem;
          background: var(--bg-card);
          border-radius: var(--radius-md);
        }
        .checkpoints-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: block;
          margin-bottom: 0.4rem;
        }
        .checkpoint-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .checkpoint-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: var(--bg-surface);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          color: var(--text-primary);
        }
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .spec-box {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .spec-title {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: block;
        }
        .spec-value {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .days-box {
          margin-bottom: 1.25rem;
        }
        .day-pills-row {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.4rem;
        }
        .day-tag {
          padding: 0.3rem 0.65rem;
          background: var(--bg-card);
          border-radius: 4px;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .day-tag-active {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }
        .notes-box {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid var(--primary-border);
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          color: var(--text-primary);
        }
        .driver-profile-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .driver-avatar-lg {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--primary-light);
          border: 2px solid var(--primary);
          color: var(--primary);
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .college-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .driver-bio {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0.75rem 0;
        }
        .driver-contact-meta {
          width: 100%;
          background: var(--bg-card);
          padding: 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }
        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
        }
        .sidebar-actions {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .w-full { width: 100%; }
        .passengers-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .passenger-row {
          background: var(--bg-card);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .passenger-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .p-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--bg-surface);
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-name { font-size: 0.88rem; font-weight: 600; }
        .p-meta { font-size: 0.72rem; color: var(--text-muted); }
        @media (max-width: 900px) {
          .detail-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default RideDetailPage;
