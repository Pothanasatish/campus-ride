import React, { useState, useEffect } from 'react';
import RideCard from '../components/domain/RideCard';
import RequestModal from '../components/domain/RequestModal';
import API from '../services/api';
import { Search, Filter, MapPin, Clock, Bike, Car, RotateCcw } from 'lucide-react';

const RideSearchPage = () => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async (overrideParams = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const src = overrideParams.source !== undefined ? overrideParams.source : source;
      const dest = overrideParams.destination !== undefined ? overrideParams.destination : destination;
      const time = overrideParams.departureTime !== undefined ? overrideParams.departureTime : departureTime;
      const vType = overrideParams.vehicleType !== undefined ? overrideParams.vehicleType : vehicleType;

      if (src) params.append('source', src);
      if (dest) params.append('destination', dest);
      if (time) params.append('departureTime', time);
      if (vType) params.append('vehicleType', vType);

      const res = await API.get(`/rides?${params.toString()}`);
      if (res.success) {
        setRides(res.data);
      }
    } catch (err) {
      console.error('[Search Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRides();
  };

  const handleReset = () => {
    setSource('');
    setDestination('');
    setDepartureTime('');
    setVehicleType('');
    fetchRides({ source: '', destination: '', departureTime: '', vehicleType: '' });
  };

  return (
    <div className="search-page">
      <div className="page-header">
        <h1 className="heading-xl">Find Compatible Rides</h1>
        <p className="text-sub">Discover fellow verified college students commuting along matching routes</p>
      </div>

      {/* Filter Panel */}
      <form onSubmit={handleSearchSubmit} className="filter-panel">
        <div className="filter-grid">
          <div className="form-group mb-0">
            <label className="form-label">Commute Source</label>
            <div className="input-with-icon">
              <MapPin size={16} className="input-icon" />
              <input
                type="text"
                placeholder="e.g. Bhimavaram Town Center"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Destination Campus</label>
            <div className="input-with-icon">
              <MapPin size={16} className="input-icon" />
              <input
                type="text"
                placeholder="e.g. SRKR Campus Gate 1"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Preferred Time</label>
            <div className="input-with-icon">
              <Clock size={16} className="input-icon" />
              <input
                type="text"
                placeholder="e.g. 08:00 AM"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group mb-0">
            <label className="form-label">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="form-select"
            >
              <option value="">All Vehicles</option>
              <option value="Bike">Bike / Two-Wheeler</option>
              <option value="Scooter">Scooter</option>
              <option value="Car">Car / Four-Wheeler</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button type="button" onClick={handleReset} className="btn btn-secondary btn-sm">
            <RotateCcw size={14} /> Reset
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            <Search size={14} /> Search Rides
          </button>
        </div>
      </form>

      {/* Results Header */}
      <div className="results-header">
        <span className="results-count">
          Showing <strong>{rides.length}</strong> available commute options
        </span>
      </div>

      {/* Rides List */}
      {loading ? (
        <div className="skeleton-grid">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      ) : rides.length > 0 ? (
        <div className="rides-grid">
          {rides.map((ride) => (
            <RideCard
              key={ride._id}
              ride={ride}
              onRequestClick={(r) => setSelectedRide(r)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <Search size={40} color="var(--text-muted)" />
          <h3>No Compatible Rides Found</h3>
          <p>Try broadening your search locations or time filters.</p>
        </div>
      )}

      {/* Request Modal */}
      {selectedRide && (
        <RequestModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onSuccess={() => {
            alert('Ride request submitted successfully!');
            fetchRides();
          }}
        />
      )}

      <style>{`
        .search-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .filter-panel {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .filter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .mb-0 {
          margin-bottom: 0 !important;
        }
        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-with-icon .form-input {
          padding-left: 2.5rem;
          width: 100%;
        }
        .filter-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--bg-card-border);
        }
        .results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        .rides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .empty-state-card {
          text-align: center;
          padding: 4rem 1.5rem;
          background: var(--bg-surface);
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
        }
      `}</style>
    </div>
  );
};

export default RideSearchPage;
