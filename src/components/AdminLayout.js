// src/components/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Top Navbar */}
      <nav className="admin-navbar bg-dark text-white d-flex justify-content-between align-items-center px-4">
        <h4 className="my-2">Admin Dashboard</h4>
        <button className="btn btn-outline-light" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Sidebar + Main */}
      <div className="admin-content">
        <aside className="admin-sidebar bg-dark text-white">
          <h5 className="p-3">Admin Panel</h5>
          <ul className="nav flex-column px-2">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/admin/applications">Applications</Link>
            </li>
          </ul>
        </aside>

        <main className="admin-main p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
