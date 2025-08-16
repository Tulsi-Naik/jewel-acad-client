//src/components/Ledger.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2pdf from 'html2pdf.js';

const Ledger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [newCustomerId, setNewCustomerId] = useState('');
  const [newProductIds, setNewProductIds] = useState([]);
  const [newTotal, setNewTotal] = useState('');
  const [loading, setLoading] = useState(false);
  const componentRefs = useRef({});
  const [noData, setNoData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalLedgerId, setModalLedgerId] = useState(null);
  const [modalAmount, setModalAmount] = useState('');
const [statusFilter, setStatusFilter] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error', err);
    }
  };

  const fetchLedger = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/ledger');
      console.log('📦 Ledger response:', res.data);

      if (!res.data || !Array.isArray(res.data)) {
        console.error('⚠️ Unexpected response:', res);
        toast.error('Unexpected response from server');
        return;
      }

      const allLedgers = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLedgerData(allLedgers);
      setFilteredData(allLedgers);
      setNoData(allLedgers.length === 0);
    } catch (err) {
      if (err.response) {
        console.error('❌ Ledger fetch failed:', err.response.data);
      } else {
        console.error('❌ Error fetching ledger:', err.message || err);
      }
      toast.error('Failed to load ledger data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error', err);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchLedger();
  }, [fetchLedger]);

  const filterByCustomer = () => {
  const filtered = ledgerData.filter(entry => {
    const matchesCustomerId = customerId ? entry.customer?._id === customerId : true;
    const matchesCustomerName = customerName
      ? entry.customer?.name?.toLowerCase().includes(customerName.toLowerCase())
      : true;
    const matchesStatus =
      statusFilter === 'paid' ? entry.paid :
      statusFilter === 'unpaid' ? !entry.paid :
      true; // "All"

    return matchesCustomerId && matchesCustomerName && matchesStatus;
  });

  setFilteredData(filtered);

  filtered.length > 0
    ? toast.info(`Filtered ${filtered.length} record(s)`)
    : toast.warning('No Matching Records Found');
};

const handleClearFilters = () => {
  setCustomerId('');        // Reset dropdown
  setCustomerName('');      // Reset text input
  document.getElementById('paymentStatusSelect').value = ''; // Reset status select
  setFilteredData(ledgerData); // Show all ledger entries
  toast.info('Filters Cleared');
};


  const handleAddLedger = async () => {
    if (!newCustomerId || !newTotal || newProductIds.length === 0) {
      return toast.warning('Customer, Products, and Total amount are required');
    }

    try {
      const existingLedger = ledgerData.find(
        ledger => ledger.customer?._id === newCustomerId && !ledger.paid
      );

      if (existingLedger) {
        const updatedTotal = existingLedger.total + parseFloat(newTotal);
        const updatedProductIds = [...new Set([...existingLedger.products.map(p => p._id), ...newProductIds])];

        await axios.put(`/ledger/${existingLedger._id}`, {
          total: updatedTotal,
          products: updatedProductIds,
        });
      } else {
        await axios.post('/ledger', {
          customer: newCustomerId,
          products: newProductIds,
          total: parseFloat(newTotal),
        });
      }

      setNewCustomerId('');
      setNewProductIds([]);
      setNewTotal('');
      fetchLedger();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePDF = (ledgerId) => {
    const entry = filteredData.find(e => e._id === ledgerId);
    if (!entry) return toast.error("Ledger entry not found");

    const pdfContent = document.createElement('div');
    pdfContent.innerHTML = `
      <div style="padding: 20px; font-family: Arial; border: 2px solid #000; width: 100%;">
        <h2 style="text-align: center; color: #2c3e50;">Customer Ledger</h2>
        <hr />
        <p><strong>Customer Name:</strong> ${entry.customer?.name || 'N/A'}</p>
        <p><strong>Contact:</strong> ${entry.customer?.contact || 'N/A'}</p>
        <p><strong>Address:</strong> ${entry.customer?.address || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date(entry.createdAt).toLocaleString()}</p>
        <p><strong>Products:</strong></p>
        <ul>
          ${entry.products?.map(p => {
            const name = p.product?.name || p.name || 'Unnamed';
            const qty = p.quantity || 0;
            const price = p.product?.price || 0;
            const lineTotal = qty * price;
            return `<li>${name} x${qty} — ₹${lineTotal.toFixed(2)}</li>`;
          }).join('') || '<li>None</li>'}
        </ul>
        <p><strong>Total Pending:</strong> ₹${entry.total?.toFixed(2) || '0.00'}</p>
        <div style="margin-top: 30px; text-align: right;">
          <p>Authorized Signature __________________</p>
        </div>
      </div>
    `;

    const opt = {
      margin: 0.3,
      filename: `ledger_${ledgerId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(pdfContent).set(opt).save();
  };

  const markAsPaid = async (id) => {
    try {
      const res = await axios.patch(`/ledger/${id}/pay`);

      if (res.data.success) {
        toast.success('Marked as paid');
        fetchLedger();
      } else {
        toast.error('Failed to mark as paid');
      }
    } catch (err) {
      console.error('Error marking as paid:', err);
      toast.error('Something went wrong');
    }
  };

  const handlePartialPay = (id) => {
    setModalLedgerId(id);
    setShowModal(true);
  };

  const handleModalSubmit = async (amount) => {
    try {
      const res = await axios.patch(`/ledger/${modalLedgerId}/partial-pay`, {
        amount
      });

      if (res.data.success) {
        toast.success('Partial payment updated');
        fetchLedger();
      } else {
        toast.error('Failed to update payment');
      }
    } catch (err) {
      console.error('Partial payment error:', err);
      toast.error('Something went wrong');
    } finally {
      setShowModal(false);
      setModalLedgerId(null);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Customer Ledger</h2>
      <div className="row mb-3">
        <div className="col-md-3">
          <label>Customer Name</label>
          <input
            type="text"
            className="form-control"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="Enter Customer Name"
          />
        </div>

        <div className="col-md-3">
          <label>Select Customer</label>
          <select
            className="form-control"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            <option value="">All Customers</option>
            {customers.map(c => (
              <option key={c._id} value={c._id}>{c.name} ({c.contact})</option>
            ))}
          </select>
        </div>
<div className="col-md-3">
  <label>Payment Status</label>
  <select
    className="form-control"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="">All</option>
    <option value="paid">Paid</option>
    <option value="unpaid">Unpaid</option>
  </select>
</div>



        <div className="col-md-3 align-self-end">
          <button className="btn btn-primary mt-2" onClick={filterByCustomer}>Filter</button>
          <button className="btn btn-secondary mt-2 ms-2" onClick={handleClearFilters}>Clear Filters</button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : noData ? (
        <p className="text-center text-muted mt-4">No ledger entries yet. Add one to get started!</p>
      ) : (
        filteredData.map((entry, index) => (
          <div key={index} className="card mb-3 shadow">
            <div className={`card-header text-white d-flex justify-content-between align-items-center ${entry.paid ? 'bg-success' : 'bg-dark'}`}>
              <div>
                <strong>{entry.customer?.name || 'Unknown'}</strong> | {entry.customer?.contact || 'N/A'}
              </div>
              <div className="d-flex gap-2">
                {!entry.paid && (
                  <>
                    <button className="btn btn-sm btn-success" onClick={() => markAsPaid(entry._id)}>
                      Mark as Paid
                    </button>
                    <button className="btn btn-sm btn-info" onClick={() => handlePartialPay(entry._id)}>
                      Partial Pay
                    </button>
                  </>
                )}
                <button className="btn btn-sm btn-warning" onClick={() => handleGeneratePDF(entry._id)}>
                  Download PDF
                </button>
              </div>
            </div>
            <div className="card-body">
              <p><strong>Address:</strong> {entry.customer?.address || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}</p>

              {entry.paid && entry.paidAt && (
                <p><strong>Paid At:</strong> {new Date(entry.paidAt).toLocaleString()}</p>
              )}

              <p><strong>Products:</strong></p>
              <ul className="mb-2">
                {entry.products?.map((p, idx) => {
                  const name = p.product?.name || 'Unnamed';
                  const qty = p.quantity || 0;
                  const price = p.product?.price || 0;
                  const lineTotal = qty * price;

                  return (
                    <li key={idx}>
                      {name} — Qty: {qty} — ₹{lineTotal.toFixed(2)}
                    </li>
                  );
                })}
              </ul>

              {entry.paidAmount > 0 && (
                <p><strong>Paid:</strong> ₹{entry.paidAmount.toFixed(2)}</p>
              )}

              <p><strong>Total Remaining:</strong> ₹{entry.total.toFixed(2)}</p>

              <p>
                <strong>Status:</strong>{' '}
                <span style={{ color: entry.paid ? 'green' : 'red', fontWeight: 'bold' }}>
                  {entry.paid ? 'Paid' : 'Unpaid'}
                </span>
              </p>
            </div>
          </div>
        ))
      )}

      {/*  Correctly placed PartialPayModal inside Ledger's return */}
      <PartialPayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        customerName={
          modalLedgerId
            ? filteredData.find(e => e._id === modalLedgerId)?.customer?.name || ''
            : ''
        }
      />
    </div>
  );
};

// 🔹 Modal Component
const PartialPayModal = ({ isOpen, onClose, onSubmit, customerName }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.warning('Enter a valid amount');
      return;
    }

    onSubmit(parseFloat(amount));
    setAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Partial Payment for {customerName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="number"
              className="form-control"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
