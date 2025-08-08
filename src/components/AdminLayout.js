// src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
const location = useLocation();

  const handleLogout = () => {
    // implement your logout logic here
    localStorage.removeItem('adminToken'); // example
    navigate('/');
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Top Navbar */}
      <header className="admin-navbar">
        <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h1 className="admin-title">Admin Panel</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      {/* Sidebar */}
<div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
  <Link
    to="/admin/dashboard"
    className={location.pathname === '/admin/dashboard' ? 'active' : ''}
    onClick={() => setSidebarOpen(false)} // close sidebar on click
  >
    Dashboard
  </Link>
  <Link
    to="/admin/applications"
    className={location.pathname === '/admin/applications' ? 'active' : ''}
    onClick={() => setSidebarOpen(false)} // close sidebar on click
  >
    Applications
  </Link>
</div>


      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
