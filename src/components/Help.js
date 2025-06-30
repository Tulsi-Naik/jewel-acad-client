import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Help = () => {
  return (
    <div className="container py-5">
      {/* Header */}
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Varad Consultants & Analyst Pvt.Ltd</h1>
        <p className="lead text-muted">How can we help you today?</p>
      </header>

      {/* Contact Section */}
      <section className="mb-5">
        <h2 className="mb-4 text-secondary">Contact Us</h2>
        <div className="card shadow-sm">
          <div className="card-body">
          <p><i className="bi bi-globe me-2"></i><strong>Website:</strong> <a href="https://www.varadanalyst.com" target="_blank" rel="noopener noreferrer">www.varadanalyst.com</a></p>
<p><i className="bi bi-telephone me-2"></i><strong>Phone:</strong> <a href="tel:+918446448461">+91 8446448461</a></p>
<p><i className="bi bi-geo-alt me-2"></i><strong>Address:</strong> 505, Shivcity Center, Vijaynagar, Sangli 416416</p>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
