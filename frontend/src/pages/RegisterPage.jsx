import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, User, GraduationCap, Phone, AlertCircle, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: 'SRKR Engineering College',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registerOnly } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await registerOnly(formData);
      if (res.success) {
        // Redirect directly to login page with success notification state
        navigate('/login?registered=true');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <div className="logo-badge" onClick={() => navigate('/')}>
            <Car size={26} color="#10b981" />
          </div>
          <h2 className="heading-lg">Create Student Account</h2>
          <p className="text-sub">Join verified college commute network</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Satish Verma"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <input
              type="email"
              name="email"
              required
              placeholder="satish.verma@srkr.edu.in"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="grid-2-col">
            <div className="form-group">
              <label className="form-label">College / University</label>
              <input
                type="text"
                name="college"
                required
                value={formData.college}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch / Department</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Computer Science & Engineering">Computer Science & Engg</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Comm Engg</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>
          </div>

          <div className="grid-2-col">
            <div className="form-group">
              <label className="form-label">Academic Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-select"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <span>Already registered? </span>
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          background: var(--bg-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .auth-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          width: 100%;
          padding: 2.25rem;
          box-shadow: var(--shadow-lg);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .logo-badge {
          width: 52px;
          height: 52px;
          background: var(--primary-light);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
          cursor: pointer;
        }
        .error-alert {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .grid-2-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .auth-link {
          color: var(--primary);
          font-weight: 600;
        }
        @media (max-width: 600px) {
          .grid-2-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
