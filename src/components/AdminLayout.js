// src/components/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css'; // optional custom styles

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar bg-dark text-white">
        <h4 className="p-3">Admin Panel</h4>
        <ul className="nav flex-column p-2">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/applications">Applications</Link>
          </li>
        </ul>
        <button className="btn btn-outline-light m-3" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="admin-main p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
