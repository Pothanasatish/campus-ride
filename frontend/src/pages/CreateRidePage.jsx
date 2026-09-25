import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { PlusCircle, MapPin, Clock, Calendar, Car, AlertCircle, ArrowLeft } from 'lucide-react';

const CreateRidePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    source: 'Bhimavaram Town Center',
    destination: 'SRKR Campus Gate 1',
    pickupPoints: 'Town Hall Junction, Old Bus Stand',
    departureTime: '08:00 AM',
    returnTime: '05:30 PM',
    recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableSeats: 1,
    totalSeats: 1,
    vehicleType: 'Bike',
    vehicleModel: 'Royal Enfield Hunter 350',
    vehicleNumber: 'AP 37 BK 4092',
    notes: 'Strict punctuality. Helmet mandatory for passenger.',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    const currentDays = formData.recurringDays;
    if (currentDays.includes(day)) {
      setFormData({
        ...formData,
        recurringDays: currentDays.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        recurringDays: [...currentDays, day],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      return setError('Source and Destination cannot be identical.');
    }

    if (formData.recurringDays.length === 0) {
      return setError('Please select at least one recurring commute day.');
    }

    setLoading(true);

    try {
      const res = await API.post('/rides', formData);
      if (res.success) {
        navigate('/my-rides');
      }
    } catch (err) {
      setError(err.message || 'Failed to create commute offer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-ride-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm mb-2">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="heading-xl">Offer a Commute</h1>
        <p className="text-sub">Create your recurring college commute schedule and share empty seats</p>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-card">
        {/* Section 1: Route */}
        <div className="form-section">
          <h3 className="section-title">1. Commute Route & Pickup Stops</h3>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Source Location *</label>
              <input
                type="text"
                name="source"
                required
                placeholder="e.g. Bhimavaram Town Center"
                value={formData.source}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination Campus / Location *</label>
              <input
                type="text"
                name="destination"
                required
                placeholder="e.g. SRKR Campus Gate 1"
                value={formData.destination}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Intermediate Pickup Checkpoints (Comma separated)</label>
            <input
              type="text"
              name="pickupPoints"
              placeholder="e.g. Town Hall Junction, Old Bus Stand, JNR Circle"
              value={formData.pickupPoints}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Section 2: Timing & Schedule */}
        <div className="form-section">
          <h3 className="section-title">2. Schedule & Timing</h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Outbound Departure Time *</label>
              <input
                type="text"
                name="departureTime"
                required
                placeholder="e.g. 08:00 AM"
                value={formData.departureTime}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Return Departure Time (Optional)</label>
              <input
                type="text"
                name="returnTime"
                placeholder="e.g. 05:30 PM"
                value={formData.returnTime}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Active Recurring Days *</label>
            <div className="day-picker-grid">
              {daysOptions.map((day) => {
                const isSelected = formData.recurringDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`day-selector ${isSelected ? 'day-selected' : ''}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Vehicle & Seats */}
        <div className="form-section">
          <h3 className="section-title">3. Vehicle & Seats Details</h3>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Bike">Bike / Motorcycle</option>
                <option value="Scooter">Scooter</option>
                <option value="Car">Car / Four-Wheeler</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Available Seats *</label>
              <input
                type="number"
                name="availableSeats"
                min={1}
                max={6}
                required
                value={formData.availableSeats}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Seat Capacity *</label>
              <input
                type="number"
                name="totalSeats"
                min={1}
                max={6}
                required
                value={formData.totalSeats}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Vehicle Model (Optional)</label>
              <input
                type="text"
                name="vehicleModel"
                placeholder="e.g. Royal Enfield Hunter 350 / Hyundai i20"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vehicle License Plate (Optional)</label>
              <input
                type="text"
                name="vehicleNumber"
                placeholder="e.g. AP 37 BK 4092"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Punctuality & Guidelines Note</label>
            <textarea
              rows={3}
              name="notes"
              placeholder="e.g. Helmet mandatory for passenger. Please arrive 5 minutes early."
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            <PlusCircle size={18} />
            {loading ? 'Publishing Offer...' : 'Publish Commute Offer'}
          </button>
        </div>
      </form>

      <style>{`
        .create-ride-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 840px;
          margin: 0 auto;
        }
        .mb-2 {
          margin-bottom: 0.75rem;
        }
        .error-alert {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        .form-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--bg-card-border);
        }
        .form-section:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }
        .section-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary);
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }
        .day-picker-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .day-selector {
          padding: 0.5rem 1rem;
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }
        .day-selector:hover {
          border-color: var(--primary);
        }
        .day-selected {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary-border);
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1rem;
        }
        @media (max-width: 600px) {
          .grid-2, .grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateRidePage;
