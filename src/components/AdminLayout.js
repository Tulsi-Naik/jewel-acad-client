import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Hamburger */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar bg-dark text-white ${sidebarOpen ? 'show' : ''}`}>
        <h4 className="p-3">Admin Panel</h4>
        <ul className="nav flex-column p-2">
          <li className="nav-item">
            <Link
              className={`nav-link text-white ${isActive('/admin/dashboard') ? 'active-link' : ''}`}
              to="/admin/dashboard"
              onClick={closeSidebarOnMobile}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link text-white ${isActive('/admin/applications') ? 'active-link' : ''}`}
              to="/admin/applications"
              onClick={closeSidebarOnMobile}
            >
              Applications
            </Link>
          </li>
        </ul>
        <button className="btn btn-outline-light m-3" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
