import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Bell, Check, CheckCheck, Clock, Car } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await API.get('/notifications');
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('[Notifications Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1 className="heading-xl">Notification Center</h1>
          <p className="text-sub">Stay updated with your ride requests, confirmations, and campus commute alerts</p>
        </div>

        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
            <CheckCheck size={16} /> Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading-spinner">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-card ${!n.read ? 'unread-card' : ''}`}
              onClick={() => !n.read && handleMarkRead(n._id)}
            >
              <div className="n-icon">
                <Bell size={18} color={!n.read ? '#10b981' : 'var(--text-muted)'} />
              </div>

              <div className="n-content">
                <div className="n-header">
                  <h4 className="n-title">{n.title}</h4>
                  <span className="n-time">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="n-msg">{n.message}</p>
              </div>

              {!n.read && (
                <div className="unread-dot" title="Unread notification"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-card">
          <Bell size={36} color="var(--text-muted)" />
          <h3>No Notifications Yet</h3>
          <p>You're all caught up! New request updates will appear here.</p>
        </div>
      )}

      <style>{`
        .notifications-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
          margin: 0 auto;
        }
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .notification-card {
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          position: relative;
          cursor: pointer;
          transition: var(--transition);
        }
        .unread-card {
          border-color: var(--primary-border);
          background: var(--bg-card);
        }
        .n-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .n-content {
          flex: 1;
        }
        .n-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }
        .n-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .n-time {
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .n-msg {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .unread-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
          align-self: center;
        }
        .empty-state-card {
          text-align: center;
          padding: 4rem 1.5rem;
          background: var(--bg-surface);
          border: 1px dashed var(--bg-card-border);
          border-radius: var(--radius-lg);
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
