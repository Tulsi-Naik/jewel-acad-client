import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top px-4 py-3">
    <NavLink className="navbar-brand" to="/"> अलंकृत </NavLink>
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
      </ul>
    </div>
  </nav>
);

export default Navbar;
