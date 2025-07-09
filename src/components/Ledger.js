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

  const fetchProducts = async () => {
    try {
const res = await axios.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Error', err);
    }
  };
  const groupByCustomer = (data) => {
  const grouped = data.reduce((acc, entry) => {
    const custId = entry.customer?._id || entry.customer;
if (!custId) return acc;

    if (!acc[custId]) {
      acc[custId] = {
        ...entry,
        total: parseFloat(entry.total),
        products: [...(entry.products || [])],
        createdAt: entry.createdAt,
      };
    } else {
      acc[custId].total += parseFloat(entry.total);
      const allProducts = [...(acc[custId].products || []), ...(entry.products || [])];
const uniqueMap = new Map();

allProducts.forEach(p => {
  const key = p._id?.toString?.() || p.name;  // fallback if _id missing
  if (!uniqueMap.has(key)) {
    uniqueMap.set(key, p);
  }
});

acc[custId].products = Array.from(uniqueMap.values());

      if (new Date(entry.createdAt) > new Date(acc[custId].createdAt)) {
        acc[custId].createdAt = entry.createdAt;
      }
    }
    return acc;
  }, {});

  return Object.values(grouped);
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
setFilteredData(groupByCustomer(allLedgers));
setNoData(allLedgers.length === 0); // ✅ this line tracks if there's no data

    setFilteredData(groupByCustomer(allLedgers));
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
      const matchesCustomerName = customerName ? entry.customer?.name?.toLowerCase().includes(customerName.toLowerCase()) : true;
      return matchesCustomerId && matchesCustomerName;
    });
    setFilteredData(groupByCustomer(filtered));
    
    filtered.length > 0
      ? toast.info(`Filtered ${filtered.length} record(s)`)
      : toast.warning('No Matching Records Found');
  };

  const handleClearFilters = () => {
    setCustomerId('');
    setCustomerName('');
    setFilteredData(groupByCustomer(ledgerData));
    toast.info('Filters Cleared');
  };
const handleAddLedger = async () => {
  if (!newCustomerId || !newTotal || newProductIds.length === 0) {
    return toast.warning('Customer, Products, and Total amount are required');
  }

  try {
    //const productNames = newProductIds.map(id => products.find(p => p._id === id)?.name).filter(Boolean);
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
  if (!entry) return toast.error(" ");
  const pdfContent = document.createElement('div');
pdfContent.innerHTML = `
  <div style="padding: 20px; font-family: Arial; border: 2px solid #000; width: 100%;">
    <h2 style="text-align: center; color: #2c3e50;">Customer Ledger</h2>
    <hr />
    <p><strong>Customer Name:</strong> ${entry.customer?.name || 'N/A'}</p>
    <p><strong>Contact:</strong> ${entry.customer?.contact || 'N/A'}</p>
    <p><strong>Address:</strong> ${entry.customer?.address || 'N/A'}</p>
    <p><strong>Date:</strong> ${new Date(entry.createdAt).toLocaleString()}</p>
    <p><strong>Products:</strong> ${entry.products?.map(p => p.name).join(', ') || 'None'}</p>
    <p><strong>Amount Paid:</strong> ₹${entry.paidAmount?.toFixed(2) || '0.00'}</p>
    <p><strong>Total Pending:</strong> ₹${entry.total?.toFixed(2) || '0.00'}</p>
    <p><strong>Status:</strong> ${entry.paid ? 'Paid' : 'Unpaid'}</p>
    ${entry.paidAt ? `<p><strong>Paid At:</strong> ${new Date(entry.paidAt).toLocaleString()}</p>` : ''}
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
      fetchLedger(); // reloads data
    } else {
      toast.error('Failed to mark as paid');
    }
  } catch (err) {
    console.error('Error marking as paid:', err);
    toast.error('Something went wrong');
  }
};


const handlePartialPay = async (id) => {
  const amount = prompt('Enter partial amount to pay:');
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    return toast.warning('Please enter a valid amount');
  }
  try {
    const res = await axios.patch(`/ledger/${id}/partial-pay`, {
  amount: parseFloat(amount),
});

    res.data.success ? toast.success('Partial payment updated') : toast.error();
    fetchLedger();
  } catch (err) {
    console.error('Partial payment error:', err);
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
    onChange={(e) => {
      const status = e.target.value;
      let filtered = ledgerData;

      if (status === 'paid') {
        filtered = ledgerData.filter(l => l.paid);
      } else if (status === 'unpaid') {
        filtered = ledgerData.filter(l => !l.paid);
      }

      setFilteredData(groupByCustomer(filtered));
    }}
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
      

      {/* Ledger Display */}
     {loading ? (
  <p>Loading...</p>
) : noData ? (
  <p className="text-center text-muted mt-4">No ledger entries yet. Add one to get started!</p>
) : (
  filteredData.map((entry, index) => (
    <div
      key={index}
      className="card mb-3 shadow"
      ref={(el) => (componentRefs.current[entry._id] = el)}
    >
      <div className={`card-header d-flex justify-content-between align-items-center ${entry.paid ? 'bg-success text-white' : 'bg-dark text-white'}`}>
        <span><strong>{entry.customer?.name || 'Unknown'}</strong> | {entry.customer?.contact || 'N/A'}</span>
        <div>
          {!entry.paid && (
            <button className="btn btn-sm btn-success me-2" onClick={() => markAsPaid(entry._id)}>
              Mark as Paid
            </button>
          )}
          {!entry.paid && (
            <button className="btn btn-sm btn-info me-2" onClick={() => handlePartialPay(entry._id)}>
              Partial Pay
            </button>
          )}
          <button className="btn btn-sm btn-warning" onClick={() => handleGeneratePDF(entry._id)}>Download PDF</button>
        </div>
      </div>
      <div className="card-body">
        <p><strong>Address:</strong> {entry.customer?.address || 'N/A'}</p>
        <p><strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}</p>
<p><strong>Products Purchased:</strong></p>
<ul className="mb-2">
  {entry.products?.map((p, i) => (
    <li key={i}>{p.product?.name || 'Unnamed'} — Qty: {p.quantity}</li>
  )) || <li>None</li>}
</ul>
        {entry.paid && (
          <p><strong>Paid Amount:</strong> ₹{entry.paidAmount?.toFixed(2) || '0.00'}</p>
        )}
        <p><strong>Total Pending Amount:</strong> ₹{entry.total?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  ))
)}

      

    </div>
  );
};

export default Ledger;

