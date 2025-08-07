// src/components/ApplyForm.jsx
import React, { useState } from 'react';
import './ApplyForm.css';

function ApplyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('🎉 Your application has been submitted! Our team will get in touch soon.');
    // TODO: Send data to backend
  };

  return (
    <section className="apply-section">
      <div className="apply-container">
        <div className="apply-text">
          <h2>Apply for a Vendor Account</h2>
          <p>
            Start your journey with us. Fill out the form below and our team will get in touch with you.
          </p>
        </div>

        <form className="apply-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Your Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
          <input name="businessName" placeholder="Business Name" onChange={handleChange} required />
          <textarea name="message" placeholder="Optional Message" onChange={handleChange} />

          <button type="submit" className="apply-btn">Submit Application</button>
        </form>
      </div>
    </section>
  );
}

export default ApplyForm;
