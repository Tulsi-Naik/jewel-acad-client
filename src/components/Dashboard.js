import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Dashboard = () => {
  return (
    <div className="bakery-dashboard">
      <div className="bakery-overlay">
        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary display-5">अलंकृत ज्वेल हब</h1>
          <p className="text-muted fs-5">Welcome to the best 1 Gram Jewellery Shop in Town!</p>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Products */}
          <div className="col-sm-6 col-md-4 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">Products in Stock</h5>
                <p className="card-text text-muted">Manage and update product inventory.</p>
                <Link to="/products" className="btn btn-outline-primary mt-2">Manage Stock</Link>
              </div>
            </div>
          </div>

          {/* Customers */}
          <div className="col-sm-6 col-md-4 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">Customers</h5>
                <p className="card-text text-muted">View and manage your customer data.</p>
                <Link to="/customers" className="btn btn-outline-warning mt-2">Manage Customers</Link>
              </div>
            </div>
          </div>

          {/* Reports */}
          <div className="col-sm-6 col-md-4 col-lg-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <h5 className="card-title fw-semibold">Monthly Reports</h5>
                <p className="card-text text-muted">Check your recent sales and performance.</p>
                <Link to="/reports" className="btn btn-outline-danger mt-2">View Reports</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
