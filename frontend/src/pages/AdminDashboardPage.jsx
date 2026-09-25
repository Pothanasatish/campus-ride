import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  ShieldAlert,
  Users,
  Car,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  Search,
  Check,
  X,
  MapPin,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await API.get('/admin/stats');
      if (statsRes.success) setStats(statsRes.data);

      // 2. Fetch Users
      const usersRes = await API.get('/admin/users');
      if (usersRes.success) setUsers(usersRes.data);

      // 3. Fetch Reports
      const reportsRes = await API.get('/admin/reports');
      if (reportsRes.success) setReports(reportsRes.data);
    } catch (err) {
      console.error('[Admin Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (userId, currentStatus) => {
    try {
      const res = await API.patch(`/admin/users/${userId}/status`, {
        isVerified: !currentStatus,
      });
      if (res.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Status toggle failed.');
    }
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      const res = await API.patch(`/admin/reports/${reportId}`, { status });
      if (res.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Report update failed.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <div className="admin-chip">
            <ShieldAlert size={14} /> Safety Moderation & Analytics Portal
          </div>
          <h1 className="heading-xl" style={{ marginTop: '0.25rem' }}>
            Platform Administration
          </h1>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="tabs-header">
        <button
          onClick={() => setActiveTab('overview')}
          className={`tab-button ${activeTab === 'overview' ? 'tab-active' : ''}`}
        >
          System Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`tab-button ${activeTab === 'users' ? 'tab-active' : ''}`}
        >
          User Moderation ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`tab-button ${activeTab === 'reports' ? 'tab-active' : ''}`}
        >
          Safety Reports ({reports.filter((r) => r.status === 'pending').length} Pending)
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading admin metrics...</div>
      ) : (
        <>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content animate-fade">
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                    <Users size={22} />
                  </div>
                  <div>
                    <span className="stat-value">{stats?.totalUsers || 0}</span>
                    <span className="stat-label">Registered Students</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Car size={22} />
                  </div>
                  <div>
                    <span className="stat-value">{stats?.activeRides || 0}</span>
                    <span className="stat-label">Active Commutes</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div>
                    <span className="stat-value">{stats?.completedRides || 0}</span>
                    <span className="stat-label">Completed Rides</span>
                  </div>
                </div>

                <div className="admin-stat-card">
                  <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                    <ShieldAlert size={22} />
                  </div>
                  <div>
                    <span className="stat-value">{stats?.pendingReports || 0}</span>
                    <span className="stat-label">Pending Reports</span>
                  </div>
                </div>
              </div>

              {/* Popular Commute Routes */}
              <div className="routes-analytics-card">
                <h3 className="heading-md" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="#10b981" /> Top Campus Commute Routes Density
                </h3>
                {stats?.popularRoutes && stats.popularRoutes.length > 0 ? (
                  <div className="routes-list">
                    {stats.popularRoutes.map((r, idx) => (
                      <div key={idx} className="route-stat-item">
                        <div className="route-name">
                          <MapPin size={14} color="#10b981" /> {r.route}
                        </div>
                        <div className="route-bar-container">
                          <div className="route-bar" style={{ width: `${Math.min(r.count * 20, 100)}%` }}></div>
                        </div>
                        <span className="route-count-badge">{r.count} Rides Offered</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sub">No route analytics collected yet.</p>
                )}
              </div>
            </div>
          )}

          {/* User Moderation Tab */}
          {activeTab === 'users' && (
            <div className="tab-content animate-fade">
              <div className="table-search-bar">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="table-search-input"
                />
              </div>

              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email & College</th>
                      <th>Branch / Year</th>
                      <th>Rating</th>
                      <th>Verification</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div className="user-table-cell">
                            <div className="cell-avatar">{u.name.charAt(0)}</div>
                            <span className="cell-name">{u.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="cell-email">{u.email}</div>
                          <div className="cell-sub">{u.college}</div>
                        </td>
                        <td>{u.branch} ({u.year})</td>
                        <td>{u.rating} ★</td>
                        <td>
                          <span className={`badge badge-${u.isVerified ? 'success' : 'warning'}`}>
                            {u.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleVerification(u._id, u.isVerified)}
                            className="btn btn-secondary btn-sm"
                          >
                            Toggle Verification
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Safety Reports Tab */}
          {activeTab === 'reports' && (
            <div className="tab-content animate-fade">
              {reports.length > 0 ? (
                <div className="reports-list">
                  {reports.map((rep) => (
                    <div key={rep._id} className="report-card">
                      <div className="report-header">
                        <div>
                          <span className={`badge badge-${rep.status === 'pending' ? 'danger' : 'info'}`}>
                            {rep.status}
                          </span>
                          <h4 style={{ margin: '0.4rem 0 0.2rem 0', color: '#ef4444' }}>
                            Reason: {rep.reason}
                          </h4>
                          <span className="cell-sub">Submitted: {new Date(rep.createdAt).toLocaleString()}</span>
                        </div>

                        {rep.status === 'pending' && (
                          <div className="report-actions">
                            <button
                              onClick={() => handleResolveReport(rep._id, 'resolved')}
                              className="btn btn-primary btn-sm"
                            >
                              <Check size={14} /> Resolve & Warn User
                            </button>
                            <button
                              onClick={() => handleResolveReport(rep._id, 'dismissed')}
                              className="btn btn-secondary btn-sm"
                            >
                              <X size={14} /> Dismiss Report
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="report-parties-grid">
                        <div className="party-box">
                          <strong>Reporter:</strong> {rep.reporter?.name} ({rep.reporter?.email})
                        </div>
                        <div className="party-box" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                          <strong>Reported User:</strong> {rep.reportedUser?.name} ({rep.reportedUser?.email})
                        </div>
                      </div>

                      <div className="report-desc-box">
                        <strong>Details:</strong> "{rep.description}"
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-card">
                  <ShieldAlert size={36} color="var(--text-muted)" />
                  <h3>No Reports Submitted</h3>
                  <p>CampusRide safety compliance is clean.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <style>{`
        .admin-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .admin-chip {
          display: inline-flex;
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
        .tabs-header {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--bg-card-border);
          padding-bottom: 0.5rem;
        }
        .tab-button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          border-radius: var(--radius-md);
        }
        .tab-active {
          background: var(--bg-surface);
          color: #ef4444;
        }
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .admin-stat-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .routes-analytics-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
        }
        .routes-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .route-stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .route-name {
          font-size: 0.88rem;
          font-weight: 600;
          width: 280px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .route-bar-container {
          flex: 1;
          height: 10px;
          background: var(--bg-card);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .route-bar {
          height: 100%;
          background: var(--primary);
          border-radius: var(--radius-full);
        }
        .route-count-badge {
          font-size: 0.8rem;
          color: var(--text-muted);
          width: 120px;
          text-align: right;
        }
        .table-search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
        }
        .table-search-input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          outline: none;
          width: 100%;
        }
        .table-wrapper {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }
        .admin-table th, .admin-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--bg-card-border);
        }
        .admin-table th {
          background: var(--bg-card);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        .user-table-cell {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .cell-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cell-name { font-weight: 600; }
        .cell-email { font-weight: 500; }
        .cell-sub { font-size: 0.75rem; color: var(--text-muted); }
        .reports-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .report-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .report-actions {
          display: flex;
          gap: 0.5rem;
        }
        .report-parties-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .party-box {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
        }
        .report-desc-box {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
