import React from 'react';
import { useNavigate } from 'react-router-dom';
import RatingStars from './RatingStars';
import { MapPin, Clock, Calendar, Users, Bike, Car, ShieldCheck } from 'lucide-react';

const RideCard = ({ ride, onRequestClick }) => {
  const navigate = useNavigate();

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'Bike':
      case 'Scooter':
        return <Bike size={16} color="#10b981" />;
      case 'Car':
        return <Car size={16} color="#3b82f6" />;
      default:
        return <Car size={16} color="#10b981" />;
    }
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'Highly Compatible':
        return 'badge-success';
      case 'Good Match':
        return 'badge-primary';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="ride-card">
      <div className="card-header">
        <div className="driver-info">
          <div className="driver-avatar">
            {ride.driver?.name ? ride.driver.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="driver-name">
              {ride.driver?.name}
              <ShieldCheck size={14} color="#10b981" title="Verified Commuter" />
            </div>
            <div className="driver-meta">
              {ride.driver?.branch} • {ride.driver?.year}
            </div>
          </div>
        </div>

        <div className="driver-rating">
          <RatingStars rating={ride.driver?.rating} totalRatings={ride.driver?.totalRatings} />
        </div>
      </div>

      <div className="route-container">
        <div className="route-point">
          <MapPin size={16} color="#10b981" />
          <div>
            <span className="point-label">FROM</span>
            <span className="point-value">{ride.source}</span>
          </div>
        </div>

        <div className="route-divider">→</div>

        <div className="route-point">
          <MapPin size={16} color="#ef4444" />
          <div>
            <span className="point-label">TO</span>
            <span className="point-value">{ride.destination}</span>
          </div>
        </div>
      </div>

      <div className="card-details-grid">
        <div className="detail-chip">
          <Clock size={14} />
          <span>{ride.departureTime}</span>
        </div>

        <div className="detail-chip">
          {getVehicleIcon(ride.vehicleType)}
          <span>{ride.vehicleType}</span>
        </div>

        <div className="detail-chip">
          <Users size={14} />
          <span>{ride.availableSeats} seat(s) available</span>
        </div>
      </div>

      <div className="days-row">
        <Calendar size={13} color="var(--text-muted)" />
        <span className="days-label">Days:</span>
        <div className="day-pills">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
            const isActive = ride.recurringDays?.includes(day);
            return (
              <span key={day} className={`day-pill ${isActive ? 'day-active' : ''}`}>
                {day}
              </span>
            );
          })}
        </div>
      </div>

      <div className="card-footer">
        {ride.matchBadge && (
          <span className={`badge ${getBadgeClass(ride.matchBadge)}`}>
            {ride.matchBadge} ({ride.matchScore} pts)
          </span>
        )}

        <div className="footer-actions">
          <button
            onClick={() => navigate(`/rides/${ride._id}`)}
            className="btn btn-secondary btn-sm"
          >
            Details
          </button>
          {ride.availableSeats > 0 ? (
            <button
              onClick={() => onRequestClick && onRequestClick(ride)}
              className="btn btn-primary btn-sm"
            >
              Request Seat
            </button>
          ) : (
            <button disabled className="btn btn-secondary btn-sm" style={{ opacity: 0.6 }}>
              Full
            </button>
          )}
        </div>
      </div>

      <style>{`
        .ride-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: var(--transition);
        }
        .ride-card:hover {
          border-color: var(--primary-border);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .driver-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .driver-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--primary-light);
          border: 1px solid var(--primary-border);
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .driver-name {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .driver-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .route-container {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .route-point {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .point-label {
          display: block;
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .point-value {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .route-divider {
          color: var(--text-muted);
          font-weight: 700;
        }
        .card-details-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .detail-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          color: var(--text-secondary);
        }
        .days-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .day-pills {
          display: flex;
          gap: 0.25rem;
        }
        .day-pill {
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.7rem;
          background: var(--bg-surface);
          color: var(--text-muted);
        }
        .day-active {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--bg-card-border);
        }
        .footer-actions {
          display: flex;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default RideCard;
