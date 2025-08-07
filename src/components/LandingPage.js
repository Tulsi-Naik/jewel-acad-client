import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
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
  <img src="/product.svg" alt="Inventory Management" />
  <h3>Inventory Management</h3>
  <p>Monitor stock levels, item details, and product movement with ease.</p>
</div>


    <div className="feature-card">
      <img src="/report.svg" alt="Reports" />
      <h3>Profit Reports</h3>
      <p>Instantly see what’s selling and what’s not with insightful analytics.</p>
    </div>

    <div className="feature-card">
<img src="/customer2.svg" alt="Customer Data" className="svg-fix" />
      <h3>Customer Management</h3>
      <p>Save contact details, preferences, and view history in one place.</p>
    </div>
  </div>
</section>

<section className="support-section">
  <div className="support-content">
    <div className="support-text">
      <h2>Support You Can Count On</h2>
      <p>
        Stuck somewhere? Need help managing your jewellery business? Our team is just a call or message away. Whether it's a feature you're unsure about or a suggestion you want to share, we're ready to support you!
      </p>
    </div>
    <div className="support-image">
      <img src="/support.svg" alt="Customer Support" />
    </div>
  </div>
</section>


      {/* Testimonial Section */}
  {/* Testimonial Section */}
<section className="testimonial">
  <h2 className="testimonial-title"> What Shop Owners Say</h2>
  <Slider
    dots={true}
    infinite={true}
    speed={800}
    slidesToShow={1}
    slidesToScroll={1}
    autoplay={true}
    autoplaySpeed={5000}
    arrows={false}
  >
    <div className="testimonial-slide">
      <blockquote>
        “Using this app, I no longer worry about keeping records manually. It’s all on my phone!”
      </blockquote>
      <p className="testimonial-author">— Ramesh Jewellers, Pune</p>
    </div>
    <div className="testimonial-slide">
      <blockquote>
        “Our bookkeeping has never been easier. The ledger system is just perfect.”
      </blockquote>
      <p className="testimonial-author">— Alankrut Jewels, Nashik</p>
    </div>
    <div className="testimonial-slide">
      <blockquote>
        “From customer tracking to inventory — this app saved us hours of manual work.”
      </blockquote>
      <p className="testimonial-author">— Ratnadeep Jewellers, Mumbai</p>
    </div>
  </Slider>
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
    <p>&copy; {new Date().getFullYear()} <strong>JewelBook</strong>. All rights reserved.</p>
  </div>
</footer>

    </div>
  );
}

export default LandingPage;
