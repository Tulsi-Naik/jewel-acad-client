// src/components/ApplyForm.jsx
import React, { useState } from 'react';

function ApplyForm() {
  const [formData, setFormData] = useState({ name: '', email: '', businessName: '' });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Application submitted. Admin will review it.');
    // Later: send to backend
  };

  return (
    <div className="container p-4">
      <h2>Apply for Vendor Account</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" name="name" placeholder="Your Name" onChange={handleChange} />
        <input className="form-control my-2" name="email" placeholder="Email" onChange={handleChange} />
        <input className="form-control my-2" name="businessName" placeholder="Business Name" onChange={handleChange} />
        <button className="btn btn-success mt-3" type="submit">Submit Application</button>
      </form>
    </div>
  );
}

export default ApplyForm;
