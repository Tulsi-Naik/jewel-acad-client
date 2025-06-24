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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import MarksAsPaid from './components/MarksAsPaid';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>

        <Route path='/' element={<Dashboard />} />
        <Route path="/products" element={<ProductForm />} />
        <Route path="/sales" element={<SalesForm />} />
        <Route path="/customers" element={<CustomerForm />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/ledger" element={<Ledger />} />
        <Route path="/help" element={<Help />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={2000} />

    </Router>

  );
}

export default App;
