// src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
      <aside className="admin-sidebar">
        <nav>
          <ul>
            <li><Link to="/admin/dashboard" onClick={() => setSidebarOpen(false)}>Dashboard</Link></li>
            <li><Link to="/admin/applications" onClick={() => setSidebarOpen(false)}>Applications</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
