import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to Your Digital Ledger</h1>
            <p>Simple. Safe. Smart. Built for your business.</p>
            <button onClick={() => navigate('/apply')}>Get Started</button>

            <div className="login-buttons">
              <button onClick={() => navigate('/admin/login')} className="login-button">Login as Admin</button>
              <button onClick={() => navigate('/user/login')} className="login-button">Login as User</button>
            </div>
          </div>
          <div className="hero-image">
            <img src="/shopkeeper-counter.png" alt="Shopkeeper at counter" />
          </div>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <img src="/cartoon1.png" alt="Track Transactions" />
          <h3>Track Transactions</h3>
          <p>Manage customer payments, purchases, and dues easily.</p>
        </div>
        <div className="feature-card">
          <img src="/cartoon2.png" alt="Reports" />
          <h3>Insightful Reports</h3>
          <p>Understand your sales and profits clearly with auto-generated reports.</p>
        </div>
        <div className="feature-card">
          <img src="/cartoon3.png" alt="Secure" />
          <h3>Safe & Secure</h3>
          <p>Data backed with secure cloud storage and authentication.</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
