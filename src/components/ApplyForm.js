// src/components/ApplyForm.jsx
import React, { useState } from 'react';
import './ApplyForm.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // You’ll replace this with an actual backend API call later
      console.log('Submitted data:', formData);

      toast.success('🎉 Application submitted! We’ll contact you soon.');
      setFormData({ name: '', email: '', businessName: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
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
          <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required />
          <textarea name="message" placeholder="Optional Message" value={formData.message} onChange={handleChange} />

          <button type="submit" className="apply-btn">Submit Application</button>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </section>
  );
}

export default ApplyForm;
