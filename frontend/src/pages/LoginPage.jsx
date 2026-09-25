import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isJustRegistered = searchParams.get('registered') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid college email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-fade">
        <div className="auth-header">
          <div className="logo-badge" onClick={() => navigate('/')}>
            <Car size={26} color="#10b981" />
          </div>
          <h2 className="heading-lg">Welcome back</h2>
          <p className="text-sub">Sign in to your CampusRide college account</p>
        </div>

        {isJustRegistered && (
          <div className="success-alert">
            <CheckCircle2 size={18} />
            <span>Account created successfully! Please sign in with your credentials.</span>
          </div>
        )}

        {error && (
          <div className="error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">College Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                placeholder="satish.verma@srkr.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="demo-shortcuts">
          <div className="demo-label">
            <Sparkles size={12} color="#10b981" />
            <span>1-Click Technical Demo Accounts:</span>
          </div>
          <div className="demo-buttons">
            <button
              type="button"
              onClick={() => handleQuickDemo('satish.verma@srkr.edu.in')}
              className="demo-btn"
            >
              Provider (Satish)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ananya.rao@srkr.edu.in')}
              className="demo-btn"
            >
              Requester (Ananya)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@campusride.edu')}
              className="demo-btn admin-demo"
            >
              Admin Portal
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">Register Student Account</Link>
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
          max-width: 440px;
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
        .success-alert {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid var(--primary-border);
          color: var(--primary);
          padding: 0.75rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
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
        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }
        .input-with-icon .form-input {
          padding-left: 2.75rem;
          width: 100%;
        }
        .demo-shortcuts {
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--bg-card-border);
        }
        .demo-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 0.6rem;
        }
        .demo-buttons {
          display: flex;
          gap: 0.5rem;
        }
        .demo-btn {
          flex: 1;
          padding: 0.4rem;
          font-size: 0.72rem;
          font-weight: 600;
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }
        .demo-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
        .admin-demo:hover {
          border-color: #ef4444;
          color: #ef4444;
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
      `}</style>
    </div>
  );
};

export default LoginPage;
