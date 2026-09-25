import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <AlertCircle size={48} color="var(--primary)" />
      <h1 className="heading-xl">404 — Page Not Found</h1>
      <p className="text-sub">The page or commute route you are looking for does not exist.</p>
      <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>
        <Home size={16} /> Return to Dashboard
      </Link>

      <style>{`
        .not-found-page {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
