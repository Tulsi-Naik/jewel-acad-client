import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import VendorNavbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import SalesForm from './components/SalesForm';
import CustomerForm from './components/CustomerForm';
import Reports from './components/Reports';
import Ledger from './components/Ledger';
import Dashboard from './components/Dashboard';
import Help from './components/Help';
import Login from './components/Login';
import RequireAuth from './components/RequireAuth';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import ApplyForm from './components/ApplyForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// ✅ AdminNavbar defined inline
const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4 py-3">
      <span className="navbar-brand fw-bold">Admin dashboard</span>
      <button className="btn btn-outline-light btn-sm ms-auto" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

function App() {
  const location = useLocation();
  const path = location.pathname;

  const showVendorNavbar =
  (path === '/dashboard' ||
    path.startsWith('/products') ||
    path.startsWith('/sales') ||
    path.startsWith('/customers') ||
    path.startsWith('/reports') ||
    path.startsWith('/ledger') ||
    path === '/help');


  const showAdminNavbar = path === '/admin';

  return (
    <>
      {showVendorNavbar && <VendorNavbar />}
      {showAdminNavbar && <AdminNavbar />}

      <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/apply" element={<ApplyForm />} />

  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/products" element={<RequireAuth><ProductForm /></RequireAuth>} />
        <Route path="/sales" element={<RequireAuth><SalesForm /></RequireAuth>} />
        <Route path="/customers" element={<RequireAuth><CustomerForm /></RequireAuth>} />
        <Route path="/reports" element={<RequireAuth><Reports /></RequireAuth>} />
        <Route path="/ledger" element={<RequireAuth><Ledger /></RequireAuth>} />
        <Route path="/help" element={<Help />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
