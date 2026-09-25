import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Bell, LogOut, User, ShieldAlert } from 'lucide-react';
import API from '../../services/api';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await API.get('/notifications');
        if (res.success) {
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (err) {
        // Silent catch for navbar poll
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, [user]);

  return (
    <header className="navbar-container">
      <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
        <div className="logo-icon">
          <Car size={22} color="#10b981" />
        </div>
        <div className="logo-text">
          <span className="brand-name">Campus<span className="accent">Ride</span></span>
          <span className="brand-tag">Commute Coordination</span>
        </div>
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/notifications" className="nav-icon-button" title="Notifications">
              <Bell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </Link>

            {isAdmin && (
              <Link to="/admin" className="admin-chip">
                <ShieldAlert size={14} /> Admin Portal
              </Link>
            )}

            <div className="user-profile-pill" onClick={() => navigate('/profile')}>
              <div className="avatar-circle">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-college">{user.college ? user.college.split(' ')[0] : 'Student'}</span>
              </div>
            </div>

            <button onClick={logout} className="logout-button" title="Sign Out">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>

      <style>{`
        .navbar-container {
          height: 64px;
          background: var(--bg-surface);
          border-bottom: 1px solid var(--bg-card-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: var(--primary-light);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-name {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .accent {
          color: var(--primary);
        }
        .brand-tag {
          display: block;
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: -3px;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .nav-icon-button {
          position: relative;
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .nav-icon-button:hover {
          color: var(--text-primary);
          background: var(--bg-surface-hover);
        }
        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: var(--danger);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .admin-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .user-profile-pill {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.3rem 0.6rem;
          border-radius: var(--radius-full);
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          cursor: pointer;
          transition: var(--transition);
        }
        .user-profile-pill:hover {
          border-color: var(--primary-border);
        }
        .avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--primary);
          color: #042f2e;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-details {
          display: flex;
          flex-direction: column;
          padding-right: 0.4rem;
        }
        .user-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .user-college {
          font-size: 0.68rem;
          color: var(--text-muted);
        }
        .logout-button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }
        .logout-button:hover {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
        }
        .auth-buttons {
          display: flex;
          gap: 0.75rem;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
