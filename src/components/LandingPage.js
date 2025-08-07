import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
    <section className="landing-hero">
  <div className="hero-left">
    <h1>Your Jewellery Business, Now Digital</h1>
    <p>Track sales, customer payments, and inventory with ease.</p>
    <div className="hero-buttons">
      <button onClick={() => navigate('/apply')}>Create Your Account</button>
      <button className="secondary" onClick={() => navigate('/login')}>Login</button>
    </div>
  </div>
  <div className="hero-right">
    <img src="/hero.svg" alt="Jewellery business illustration" />
  </div>
</section>



      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Jewelers Love Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="/cartoon1.png" alt="Track Transactions" />
            <h3>Customer Ledgers</h3>
            <p>Track payments, returns, and balances seamlessly.</p>
          </div>
          <div className="feature-card">
            <img src="/cartoon2.png" alt="Reports" />
            <h3>Profit Reports</h3>
            <p>Instantly see what’s selling and what’s not with insightful analytics.</p>
          </div>
          <div className="feature-card">
            <img src="/cartoon3.png" alt="Secure" />
            <h3>Cloud Backup</h3>
            <p>Your records are always safe, secure, and available anywhere.</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial">
        <h2>What Shop Owners Say</h2>
        <blockquote>
          "Using this app, I no longer worry about keeping records manually. It’s all on my phone!"
        </blockquote>
        <p>- Ramesh Jewellers, Pune</p>
      </section>

      {/* Final CTA Section */}
      <section className="cta">
        <h2>Digitize Your Jewellery Ledger Today</h2>
        <p>Safe. Simple. Made for Indian jewelers.</p>
        <button onClick={() => navigate('/apply')}>Start Now</button>
      </section>

      {/* Footer Section */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>
            <i className="bi bi-globe me-2"></i>
            <strong>Website:</strong>{' '}
            <a href="https://www.varadanalyst.com" target="_blank" rel="noopener noreferrer">
              www.varadanalyst.com
            </a>
          </p>
          <p>
            <i className="bi bi-telephone me-2"></i>
            <strong>Phone:</strong>{' '}
            <a href="tel:+918446448461">+91 8446448461</a>
          </p>
          <p>
            <i className="bi bi-geo-alt me-2"></i>
            <strong>Address:</strong> 505, Shivcity Center, Vijaynagar, Sangli 416416
          </p>
          <p>&copy; {new Date().getFullYear()} JewelBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
