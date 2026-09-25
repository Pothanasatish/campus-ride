import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  Car,
  Clock,
  Bell,
  User,
  ShieldAlert,
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Rides', path: '/rides', icon: Search },
    { name: 'Offer Commute', path: '/rides/create', icon: PlusCircle },
    { name: 'My Rides', path: '/my-rides', icon: Car },
    { name: 'My Requests', path: '/my-requests', icon: Clock },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        <div className="nav-section-label">MAIN NAVIGATION</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}

        {isAdmin && (
          <>
            <div className="nav-section-label" style={{ marginTop: '1.5rem' }}>
              ADMINISTRATION
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `nav-item admin-item ${isActive ? 'nav-item-active' : ''}`
              }
            >
              <ShieldAlert size={18} />
              <span>Admin Portal</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="college-badge-card">
          <div className="badge-title">SRKR Community</div>
          <div className="badge-subtitle">Verified Commute Platform</div>
        </div>
      </div>

      <style>{`
        .sidebar-container {
          width: 240px;
          background: var(--bg-surface);
          border-right: 1px solid var(--bg-card-border);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem 1rem;
          min-height: calc(100vh - 64px);
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .nav-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          padding: 0 0.75rem 0.5rem 0.75rem;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 500;
          transition: var(--transition);
        }
        .nav-item:hover {
          color: var(--text-primary);
          background: var(--bg-surface-hover);
        }
        .nav-item-active {
          color: var(--primary);
          background: var(--primary-light);
          font-weight: 600;
          border-left: 3px solid var(--primary);
        }
        .admin-item.nav-item-active {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.12);
          border-left-color: #ef4444;
        }
        .sidebar-footer {
          padding-top: 1rem;
          border-top: 1px solid var(--bg-card-border);
        }
        .college-badge-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          text-align: center;
        }
        .badge-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .badge-subtitle {
          font-size: 0.68rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
