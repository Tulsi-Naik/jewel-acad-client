import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

const Dashboard = () => {
  const vendor = JSON.parse(localStorage.getItem('vendorInfo') || '{}');
  const brandFull = vendor.brandFull || 'ज्वेलरी हब';

  return (
    <div className="bakery-dashboard">
      <div className="bakery-overlay">
        <div className="text-center mb-5">
          <h1 className="fw-bold display-5 animated-title">{brandFull}</h1>
          <p className="text-muted fs-5">Welcome to the best 1 Gram Jewellery Shop in Town!</p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Products */}
          <div className="col-sm-6 col-md-4 col-lg-3">
            <div className="card shadow-sm h-100 text-center">
              <div className="card-body">
                <i className="bi bi-box-seam fs-1 text-primary mb-2"></i>
                <h5 className="card-title fw-semibold">Products in Stock</h5>
                <p className="card-text text-muted">Manage and update product inventory.</p>
                <Link to="/products" className="btn btn-outline-primary mt-2">Manage Stock</Link>
              </div>
            </div>
          </div>

          {/* Customers */}
          <div className="col-sm-6 col-md-4 col-lg-3">
            <div className="card shadow-sm h-100 text-center">
              <div className="card-body">
                <i className="bi bi-people fs-1 text-warning mb-2"></i>
                <h5 className="card-title fw-semibold">Customers</h5>
                <p className="card-text text-muted">View and manage your customer data.</p>
                <Link to="/customers" className="btn btn-outline-warning mt-2">Manage Customers</Link>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="col-sm-6 col-md-4 col-lg-3">
            <div className="card shadow-sm h-100 text-center">
              <div className="card-body">
                <i className="bi bi-bar-chart-line fs-1 text-danger mb-2"></i>
                <h5 className="card-title fw-semibold">Monthly Reports</h5>
                <p className="card-text text-muted">Check your recent sales and performance.</p>
                <Link to="/reports" className="btn btn-outline-danger mt-2">View Reports</Link>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-5 text-muted small">
          © 2025 {brandFull}. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
