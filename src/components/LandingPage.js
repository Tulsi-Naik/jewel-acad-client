import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { useEffect, useState } from "react";
function LandingPage() {
  const navigate = useNavigate();
   const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // 3 slides
    }, 7000); // Change every 4s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const track = document.getElementById("testimonial-track");
    const dots = document.querySelectorAll(".dot");

    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentSlide);
    });
  }, [currentSlide]);

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



      {/* Testimonial Section */}
     <section className="testimonial">
  <h2 className="testimonial-title">What Shop Owners Say</h2>
  <div className="testimonial-slider">
    <div className="testimonial-track" id="testimonial-track">
      <div className="testimonial-slide">
        <blockquote>
          “Using this app, I no longer worry about keeping records manually. It’s all on my phone!”
        </blockquote>
        <p className="testimonial-author">— Ramesh Jewellers, Pune</p>
      </div>
      <div className="testimonial-slide">
        <blockquote>
          “Inventory tracking has never been this easy. I check it daily before I sleep.”
        </blockquote>
        <p className="testimonial-author">— Nisha Gold, Mumbai</p>
      </div>
      <div className="testimonial-slide">
        <blockquote>
          “Our staff finds it simple and fast. Everything we need is just a tap away.”
        </blockquote>
        <p className="testimonial-author">— Omkar Ornaments, Nashik</p>
      </div>
    </div>
    <div className="testimonial-dots" id="testimonial-dots">
      <span className="dot active" onClick={() => goToSlide(0)}></span>
      <span className="dot" onClick={() => goToSlide(1)}></span>
      <span className="dot" onClick={() => goToSlide(2)}></span>
    </div>
  </div>
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
