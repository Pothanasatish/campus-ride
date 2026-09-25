import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RideCard from '../components/domain/RideCard';
import RequestModal from '../components/domain/RequestModal';
import RatingStars from '../components/domain/RatingStars';
import API from '../services/api';
import {
  Car,
  Search,
  PlusCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recommendedRides, setRecommendedRides] = useState([]);
  const [myActiveRidesCount, setMyActiveRidesCount] = useState(0);
  const [myRequestsCount, setMyRequestsCount] = useState(0);
  const [selectedRideForRequest, setSelectedRideForRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch recommended compatible rides
      const ridesRes = await API.get('/rides');
      if (ridesRes.success) {
        setRecommendedRides(ridesRes.data.slice(0, 4));
      }

      // 2. Fetch user's active offered rides count
      const myRidesRes = await API.get('/rides?myRidesOnly=true');
      if (myRidesRes.success) {
        setMyActiveRidesCount(myRidesRes.data.length);
      }

      // 3. Fetch user's requests count
      const reqRes = await API.get('/requests/my-requests');
      if (reqRes.success) {
        setMyRequestsCount(reqRes.data.length);
      }
    } catch (err) {
      console.error('[Dashboard Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <div>
          <div className="welcome-tag">
            <ShieldCheck size={14} color="#10b981" />
            <span>Verified Commuter Portal</span>
          </div>
          <h1 className="heading-xl" style={{ marginTop: '0.25rem' }}>
            Good day, <span className="accent">{user?.name}</span> 👋
          </h1>
          <p className="text-sub">
            {user?.college} • {user?.branch} ({user?.year})
          </p>
        </div>

        <div className="welcome-actions">
          <button onClick={() => navigate('/rides/create')} className="btn btn-primary">
            <PlusCircle size={18} /> Offer a Commute
          </button>
          <button onClick={() => navigate('/rides')} className="btn btn-secondary">
            <Search size={18} /> Find Rides
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate('/my-rides')}>
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Car size={22} />
          </div>
          <div>
            <span className="stat-value">{myActiveRidesCount}</span>
            <span className="stat-label">Offered Rides</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate('/my-requests')}>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <Clock size={22} />
          </div>
          <div>
            <span className="stat-value">{myRequestsCount}</span>
            <span className="stat-label">Commute Requests</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '4px' }}>
              <span className="stat-value" style={{ fontSize: '1.4rem' }}>{user?.rating || 5.0}</span>
              <RatingStars rating={user?.rating} totalRatings={user?.totalRatings} size={14} />
            </div>
            <span className="stat-label">Commuter Rating</span>
          </div>
        </div>
      </div>

      {/* Recommended Compatible Rides */}
      <div className="section-container">
        <div className="section-header">
          <div>
            <h2 className="heading-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} color="#10b981" /> Recommended Compatible Commutes
            </h2>
            <p className="text-sub">Rides matching your campus schedule ranked by compatibility score</p>
          </div>
          <button onClick={() => navigate('/rides')} className="btn btn-secondary btn-sm">
            View All Rides
          </button>
        </div>

        {loading ? (
          <div className="skeleton-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
        ) : recommendedRides.length > 0 ? (
          <div className="rides-grid">
            {recommendedRides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                onRequestClick={(r) => setSelectedRideForRequest(r)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-card">
            <Car size={36} color="var(--text-muted)" />
            <h3>No Rides Available Right Now</h3>
            <p>Be the first student to offer a commute from your neighborhood!</p>
            <button onClick={() => navigate('/rides/create')} className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
              Offer a Commute
            </button>
          </div>
        )}
      </div>

      {/* Request Seat Modal */}
      {selectedRideForRequest && (
        <RequestModal
          ride={selectedRideForRequest}
          onClose={() => setSelectedRideForRequest(null)}
          onSuccess={() => {
            alert('Ride request sent successfully!');
            fetchDashboardData();
          }}
        />
      )}

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .dashboard-welcome {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .welcome-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--primary-light);
          color: var(--primary);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .welcome-actions {
          display: flex;
          gap: 0.75rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: var(--transition);
        }
        .stat-card:hover {
          border-color: var(--primary-border);
          transform: translateY(-2px);
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-value {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: block;
          margin-top: 4px;
        }
        .section-container {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .rides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .empty-state-card {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--bg-card);
          border: 1px dashed var(--bg-card-border);
          border-radius: var(--radius-lg);
        }
        .skeleton-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .skeleton-card {
          height: 220px;
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
        @media (max-width: 768px) {
          .dashboard-welcome {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
