import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/domain/RatingStars';
import API from '../services/api';
import { User, Mail, GraduationCap, Phone, ShieldCheck, Edit3, Save, Star } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    branch: user?.branch || '',
    year: user?.year || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      const res = await API.get(`/reviews/user/${user._id}`);
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('[Profile Reviews Error]:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      alert(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="heading-xl">Student Profile</h1>
        <p className="text-sub">Manage your commute identity, contact details, and reputation</p>
      </div>

      {successMsg && (
        <div className="success-banner">
          <ShieldCheck size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="profile-grid">
        {/* Main Info Card */}
        <div className="profile-card">
          <div className="card-top-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="heading-lg">{user?.name}</h2>
              <div className="college-chip">{user?.college}</div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary btn-sm ml-auto"
            >
              <Edit3 size={14} /> {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label className="form-label">College Email Address (Protected)</label>
              <input type="email" disabled value={user?.email || ''} className="form-input disabled-input" />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Branch / Department</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Contact Number</label>
              <input
                type="text"
                disabled={!isEditing}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`form-input ${!isEditing ? 'disabled-input' : ''}`}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Commuter Bio & Vehicle Info</label>
              <textarea
                rows={3}
                disabled={!isEditing}
                placeholder="Share your daily commute habits, vehicle info, or preferred routes..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className={`form-textarea ${!isEditing ? 'disabled-input' : ''}`}
              />
            </div>

            {isEditing && (
              <button type="submit" disabled={loading} className="btn btn-primary">
                <Save size={16} /> {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
            )}
          </form>
        </div>

        {/* Reputation & Reviews Card */}
        <div className="reviews-card">
          <h3 className="heading-md" style={{ marginBottom: '1rem' }}>
            Commuter Reputation & Feedback
          </h3>

          <div className="rating-summary-box">
            <span className="big-rating-score">{user?.rating || 5.0}</span>
            <RatingStars rating={user?.rating} totalRatings={user?.totalRatings} size={18} />
            <span className="rating-subtitle">Based on {user?.totalRatings || 0} completed rides</span>
          </div>

          <div className="reviews-list">
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Public Reviews ({reviews.length})
            </h4>

            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className="review-item">
                  <div className="review-item-header">
                    <span className="reviewer-name">{rev.reviewer?.name}</span>
                    <RatingStars rating={rev.rating} size={12} />
                  </div>
                  {rev.comment && <p className="review-comment">"{rev.comment}"</p>}
                  <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <p className="text-sub" style={{ marginTop: '0.5rem' }}>
                No peer reviews received yet. Complete rides to build your reputation!
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .success-banner {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid var(--primary-border);
          color: var(--primary);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .profile-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
        }
        .profile-card, .reviews-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
        }
        .card-top-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .profile-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--primary-light);
          border: 2px solid var(--primary);
          color: var(--primary);
          font-size: 1.4rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .college-chip {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .ml-auto { margin-left: auto; }
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .disabled-input {
          opacity: 0.7;
          cursor: not-allowed;
          background: var(--bg-card);
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .rating-summary-box {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
        }
        .big-rating-score {
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }
        .rating-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .review-item {
          background: var(--bg-card);
          padding: 0.85rem;
          border-radius: var(--radius-md);
        }
        .review-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .reviewer-name {
          font-size: 0.85rem;
          font-weight: 600;
        }
        .review-comment {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-top: 0.3rem;
          font-style: italic;
        }
        .review-date {
          font-size: 0.68rem;
          color: var(--text-muted);
          display: block;
          margin-top: 0.3rem;
        }
        @media (max-width: 900px) {
          .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
