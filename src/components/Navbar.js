import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top px-4 py-3">
      <NavLink className="navbar-brand fw-bold glowing-brand" to="/">अलंकृत</NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item px-2">
            <NavLink className="nav-link" to="/products">Stock</NavLink>
          </li>
          <li className="nav-item px-2">
            <NavLink className="nav-link" to="/sales">Sales</NavLink>
          </li>
          <li className="nav-item px-2">
            <NavLink className="nav-link" to="/customers">Customers</NavLink>
          </li>
          <li className="nav-item px-2">
            <NavLink className="nav-link" to="/reports">Reports</NavLink>
          </li>
          <li className="nav-item px-2">
            <NavLink className="nav-link" to="/ledger">Ledger</NavLink>
          </li>
          <li className="nav-item px-2">
            <NavLink className="nav-link" to="/help">Help</NavLink>
          </li>
          <li className="nav-item px-2">
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};


export default Navbar;
