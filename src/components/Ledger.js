// src/components/Ledger.js
import React, { useEffect, useState, useCallback } from 'react';
import axios from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2pdf from 'html2pdf.js';

const Ledger = () => {
  const [ledgerData, setLedgerData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [expandedCustomers, setExpandedCustomers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalLedgerId, setModalLedgerId] = useState(null);

  // Fetch ledger
  const fetchLedger = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/ledger');
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLedgerData(sorted);
      setFilteredData(sorted);
    } catch (err) {
      toast.error('Failed to load ledger data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLedger();
    fetchCustomers();
  }, [fetchLedger]);

  // Group ledger by customer
const groupByCustomer = (data) => {
  return data.reduce((acc, entry) => {
    const id = entry.customer?._id || 'unknown';
    if (!acc[id]) acc[id] = [];
    acc[id].push(entry);
    return acc;
  }, {});
};





  const handleToggleExpand = (customerId) => {
    setExpandedCustomers(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  const filterLedger = () => {
    let filtered = [...ledgerData];

    if (customerId) filtered = filtered.filter(e => e.customer?._id === customerId);
    if (customerName) filtered = filtered.filter(e => e.customer?.name?.toLowerCase().includes(customerName.toLowerCase()));
    if (statusFilter) {
      filtered = filtered.filter(e => {
        const paid = e.paidAmount || 0;
        const total = e.total || 0;
        const remaining = total - paid;
        if (statusFilter === 'paid') return remaining === 0;
        if (statusFilter === 'unpaid') return paid === 0;
        if (statusFilter === 'partial') return paid > 0 && remaining > 0;
        return true;
      });
    }

    setFilteredData(filtered);
    toast.info(`Filtered ${filtered.length} record(s)`);
  };

  const handleClearFilters = () => {
    setCustomerId('');
    setCustomerName('');
    setStatusFilter('');
    setFilteredData(ledgerData);
    toast.info('Filters Cleared');
  };

  const markAsPaid = async (id) => {
    try {
      const res = await axios.patch(`/ledger/${id}/pay`);
      if (res.data.success) {
        toast.success('Marked as paid');
        fetchLedger();
      }
    } catch (err) {
      toast.error('Error marking as paid');
    }
  };

  const handlePartialPay = (id) => {
    setModalLedgerId(id);
    setShowModal(true);
  };

  const handleModalSubmit = async (amount) => {
    try {
      await axios.patch(`/ledger/${modalLedgerId}/partial-pay`, { amount });
      toast.success('Partial payment updated');
      fetchLedger();
    } catch {
      toast.error('Failed to update payment');
    } finally {
      setShowModal(false);
      setModalLedgerId(null);
    }
  };

  const handleGeneratePDF = (ledgerId) => {
    const entry = ledgerData.find(e => e._id === ledgerId);
    if (!entry) return toast.error("Ledger entry not found");

    const paidAmount = entry.paidAmount || 0;
    const total = entry.total || 0;
    const remaining = total - paidAmount;
    const status = remaining === 0 ? 'Paid' : paidAmount > 0 ? 'Partially Paid' : 'Unpaid';

    const pdfContent = document.createElement('div');
    pdfContent.innerHTML = `
      <div style="padding: 20px; font-family: Arial; border: 2px solid #000; width: 100%;">
        <h2 style="text-align: center;">Customer Ledger</h2>
        <hr />
        <p><strong>Customer Name:</strong> ${entry.customer?.name || 'N/A'}</p>
        <p><strong>Contact:</strong> ${entry.customer?.contact || 'N/A'}</p>
        <p><strong>Address:</strong> ${entry.customer?.address || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date(entry.createdAt).toLocaleString()}</p>
        <p><strong>Products:</strong></p>
        <ul>
          ${entry.products?.map(p => {
            const name = p.product?.name || 'Unnamed';
            const qty = p.quantity || 0;
            const price = p.product?.price || 0;
            return `<li>${name} — Qty: ${qty} × ₹${price.toFixed(2)}</li>`;
          }).join('') || '<li>None</li>'}
        </ul>
        <p><strong>Paid:</strong> ₹${paidAmount.toFixed(2)}</p>
        <p><strong>Total Pending:</strong> ₹${remaining.toFixed(2)}</p>
        <p><strong>Status:</strong> ${status}</p>
      </div>
    `;
    html2pdf().from(pdfContent).set({ filename: `ledger_${ledgerId}.pdf` }).save();
  };

 const grouped = groupByCustomer(filteredData); // now reflects filters


  return (
    <div className="container mt-4">
      <ToastContainer />
      <h2>Customer Ledger</h2>

      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Customer Name"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-control" value={customerId} onChange={e => setCustomerId(e.target.value)}>
            <option value="">All Customers</option>
            {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary me-2" onClick={filterLedger}>Filter</button>
          <button className="btn btn-secondary" onClick={handleClearFilters}>Clear</button>
        </div>
      </div>

      {loading ? <p>Loading...</p> : (
        Object.keys(grouped).map((custId) => {
  const entries = grouped[custId];
  const latest = entries[0];
  const totalPaid = entries.reduce((sum, e) => sum + (e.paidAmount || 0), 0);
  const totalRemaining = entries.reduce((sum, e) => sum + ((e.total || 0) - (e.paidAmount || 0)), 0);

  return (
    <div key={custId} className="card mb-3 shadow">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div>
          <strong>{latest.customer?.name}</strong> | Total Paid: ₹{totalPaid.toFixed(2)} | Remaining: ₹{totalRemaining.toFixed(2)}
        </div>
        <button className="btn btn-sm btn-info" onClick={() => handleToggleExpand(custId)}>
          {expandedCustomers[custId] ? 'Collapse' : 'History'}
        </button>
      </div>

              {expandedCustomers[custId] && (
                <div className="card-body">
                  {entries.map((entry) => {
                    const paid = entry.paidAmount || 0;
                    const total = entry.total || 0;
                    const remaining = total - paid;
                    return (
                      <div key={entry._id} className="mb-3 border p-2">
                        <p><strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
                        <p><strong>Products:</strong></p>
                        <ul>
                          {entry.products?.map((p, i) => {
                            const name = p.product?.name || 'Unnamed';
                            const qty = p.quantity || 0;
                            const price = p.product?.price || 0;
                            return <li key={i}>{name} — Qty: {qty} × ₹{price.toFixed(2)}</li>;
                          })}
                        </ul>
                        <p><strong>Paid:</strong> ₹{paid.toFixed(2)}</p>
                        <p><strong>Remaining:</strong> ₹{remaining.toFixed(2)}</p>
                        <div className="d-flex gap-2">
                          {remaining > 0 && <button className="btn btn-sm btn-success" onClick={() => markAsPaid(entry._id)}>Mark as Paid</button>}
                          {remaining > 0 && <button className="btn btn-sm btn-warning" onClick={() => handlePartialPay(entry._id)}>Partial Pay</button>}
                          <button className="btn btn-sm btn-secondary" onClick={() => handleGeneratePDF(entry._id)}>PDF</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })
      )}

      <PartialPayModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        remainingBalance={
          modalLedgerId
            ? ledgerData.find(e => e._id === modalLedgerId)?.total -
              (ledgerData.find(e => e._id === modalLedgerId)?.paidAmount || 0)
            : 0
        }
        customerName={
          modalLedgerId
            ? ledgerData.find(e => e._id === modalLedgerId)?.customer?.name || ''
            : ''
        }
      />
    </div>
  );
};

const PartialPayModal = ({ isOpen, onClose, onSubmit, remainingBalance, customerName }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || isNaN(amt)) return toast.warning('Enter valid amount');
    if (amt > remainingBalance) return toast.warning(`Cannot exceed ₹${remainingBalance.toFixed(2)}`);
    onSubmit(amt);
    setAmount('');
  };

  if (!isOpen) return null;
  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Partial Payment for {customerName}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Remaining Balance: ₹{remainingBalance.toFixed(2)}</p>
            <input type="number" className="form-control" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
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
