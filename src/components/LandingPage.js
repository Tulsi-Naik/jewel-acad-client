// src/components/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="p-5 text-center">
      <h1 className="mb-4">📘 Welcome to Your Ledger App</h1>
      <p className="mb-4">Simple, powerful bookkeeping for jewellers and vendors.</p>
      <button className="btn btn-primary me-3" onClick={() => navigate('/login')}>
        Login as Vendor
      </button>
      <button className="btn btn-outline-secondary" onClick={() => navigate('/apply')}>
        Apply for Vendor Account
      </button>
    </div>
  );
}

export default LandingPage;
