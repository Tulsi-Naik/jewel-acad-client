import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductForm from './components/ProductForm';
import SalesForm from './components/SalesForm';
import CustomerForm from './components/CustomerForm';
import Reports from './components/Reports';
import Ledger from './components/Ledger';
import Dashboard from './components/Dashboard';
import Help from './components/Help';

import Login from './components/Login';

import RequireAuth from './components/RequireAuth';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// import MarksAsPaid from './components/MarksAsPaid';

function App() {
  return (
    <Router>
      <Navbar />
     <Routes>
  <Route path="/" element={<Dashboard />} />

  <Route
    path="/products"
    element={
      <RequireAuth>
        <ProductForm />
      </RequireAuth>
    }
  />
  <Route
    path="/sales"
    element={
      <RequireAuth>
        <SalesForm />
      </RequireAuth>
    }
  />
  <Route
    path="/customers"
    element={
      <RequireAuth>
        <CustomerForm />
      </RequireAuth>
    }
  />
  <Route
    path="/reports"
    element={
      <RequireAuth>
        <Reports />
      </RequireAuth>
    }
  />
  <Route
    path="/ledger"
    element={
      <RequireAuth>
        <Ledger />
      </RequireAuth>
    }
  />
  <Route path="/help" element={<Help />} />
  <Route path="/login" element={<Login />} />
</Routes>


      <ToastContainer position="top-center" autoClose={2000} />

    </Router>

  );
}

export default App;
