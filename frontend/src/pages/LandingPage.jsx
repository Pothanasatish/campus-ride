import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Users, ShieldCheck, ArrowRight, Clock, MapPin, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-nav container">
        <div className="landing-brand">
          <div className="brand-icon">
            <Car size={24} color="#10b981" />
          </div>
          <span className="brand-title">Campus<span className="accent">Ride</span></span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Create Account</Link>
        </div>
      </header>

      <section className="hero-section container">
        <div className="hero-badge">
          <Sparkles size={14} color="#10b981" />
          <span>College Commute Coordination Platform</span>
        </div>
        <h1 className="hero-title">
          Coordinate regular daily commutes with fellow <span className="accent">verified students</span>.
        </h1>
        <p className="hero-description">
          CampusRide is a peer-to-peer transportation platform built specifically for university students traveling similar routes. Offer extra seats or discover compatible campus rides.
        </p>
        <div className="hero-cta-group">
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Browse Rides
          </Link>
        </div>
      </section>

      <section className="features-section container">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Clock size={24} color="#10b981" /></div>
            <h3>Recurring Schedules</h3>
            <p>Set your regular weekly class schedule (Mon–Fri 8:00 AM) once. The matching engine handles the rest.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MapPin size={24} color="#3b82f6" /></div>
            <h3>Deterministic Matching</h3>
            <p>Our rule-based compatibility engine ranks rides by college match, route sub-segments, and time offsets.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={24} color="#f59e0b" /></div>
            <h3>Community Safety</h3>
            <p>Exclusive to verified college email domains with transparent ratings, participant checks, and safety reports.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container footer-content">
          <p>© 2026 CampusRide — Portfolio SaaS Web Application built with React & Express.</p>
        </div>
      </footer>

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: var(--bg-dark);
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
        }
        .landing-nav {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .landing-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .brand-icon {
          width: 42px;
          height: 42px;
          background: var(--primary-light);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
        }
        .hero-section {
          padding: 4rem 1.5rem;
          text-align: center;
          max-width: 900px;
          margin-top: 2rem;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: var(--primary-light);
          border: 1px solid var(--primary-border);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }
        .hero-title {
          font-family: var(--font-heading);
          font-size: 3.25rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin-bottom: 1.5rem;
        }
        .hero-description {
          font-size: 1.15rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 720px;
          margin-left: auto;
          margin-right: auto;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        .features-section {
          padding: 4rem 1.5rem;
          margin-top: auto;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-lg);
          padding: 2rem;
          text-align: left;
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          background: var(--bg-surface);
          border: 1px solid var(--bg-card-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .feature-card h3 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .feature-card p {
          color: var(--text-secondary);
          font-size: 0.92rem;
        }
        .landing-footer {
          border-top: 1px solid var(--bg-card-border);
          padding: 2rem 0;
          margin-top: 4rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
