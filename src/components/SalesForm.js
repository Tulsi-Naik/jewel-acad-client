import React, { useState, useEffect, useRef } from 'react';
import axios from '../utils/axiosInstance';
import Select from 'react-select';
import InvoicePreview from './InvoicePreview';
import html2pdf from 'html2pdf.js';
import { toast, ToastContainer } from 'react-toastify';

import { getUserFromToken } from '../utils/auth';

const user = getUserFromToken();

const SalesForm = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [savedSaleId, setSavedSaleId] = useState(null);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newCustomerContact, setNewCustomerContact] = useState('');
  const componentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
const res1 = await axios.get('/products');
const res2 = await axios.get('/customers');
        setProducts(res1.data);
        setCustomers(res2.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
     setInvoiceNo('#' + Math.floor(100000 + Math.random() * 900000));
    const total = saleItems.reduce((acc, item) => {
  const product = products.find(p => p._id === item.product);
  if (!product) return acc;
  const price = product.price;
  const discountAmount = item.discountAmount || (price * item.discount / 100);
  const discountedPrice = price - discountAmount;
  return acc + discountedPrice * item.quantity;
}, 0);

    setTotalAmount(total);
  }, [saleItems, products]);

  const fetchProducts = async () => {
  try {
const res = await axios.get('/products');
    setProducts(res.data);
  } catch (err) {
    console.error('Error fetching products:', err);
  }
};



  const addItem = (productId) => {
    const existing = saleItems.find(item => item.product === productId);
    if (existing) {
      setSaleItems(saleItems.map(item =>
        item.product === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSaleItems([...saleItems, {
        product: productId,
        quantity: 0,
        discount: 0 ,
        discountAmount: 0
      }]);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (!customerId && (!newCustomerName.trim() || !newCustomerAddress.trim() || !newCustomerContact.trim())) ||
      saleItems.length === 0
    ) {
      return;
    }
    try {
      let finalCustomerId = customerId;
      if (!finalCustomerId && newCustomerName.trim() && newCustomerAddress.trim() && newCustomerContact.trim()) {
        const newCustomer = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/customers`, {
          name: newCustomerName.trim(),
          address: newCustomerAddress.trim(),
          contact: newCustomerContact.trim()
        });

        finalCustomerId = newCustomer.data._id;
        setCustomerId(finalCustomerId);
      }
      const saleRes = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/sales`, {
  customer: finalCustomerId,
  items: saleItems.map(item => {
    const product = products.find(p => p._id === item.product);
    const price = product?.price || 0;
    const discount = item.discount || 0;
    const discountAmount = item.discountAmount || (price * discount) / 100;
    const total = (price - discountAmount) * item.quantity;

    return {
      product: item.product,
      quantity: item.quantity,
      price,
      priceAtSale: price,       // keeps sale reports working
      discount,
      discountAmount,
      total                     // ensures ledger validation passes
    };
  })
});

      await fetchProducts(); // 🔄 Refresh product list to reflect updated stock


      setSavedSaleId(saleRes.data._id);
      setShowModal(true);
    } catch (err) {
      console.error('Error saving sale:', err);
    }
  };

const handleAddLedger = async () => {
  try {
    // Ensure we have a valid customer ID
    let ledgerCustomerId = customerId;
    if (!ledgerCustomerId && newCustomerName.trim()) {
      const newCustomer = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/customers`,
        {
          name: newCustomerName.trim(),
          address: newCustomerAddress.trim(),
          contact: newCustomerContact.trim()
        }
      );
      ledgerCustomerId = newCustomer.data._id;
      setCustomerId(ledgerCustomerId); // optional, update state
    }

    if (!ledgerCustomerId) {
      toast.error('Customer is required for ledger');
      return;
    }

    if (!savedSaleId) {
      toast.error('Sale ID not found');
      return;
    }

    // Prepare products payload
    const ledgerProducts = saleItems.map(item => {
      const productId = typeof item.product === 'string' ? item.product : item.product._id;
      const p = products.find(pr => pr._id === productId);
      const price = p?.price || 0;
      const discount = item.discount || 0;
      const discountAmount = item.discountAmount || (price * discount) / 100;
      const total = (price - discountAmount) * item.quantity;

      return {
        product: productId,
        quantity: item.quantity,
        price,
        discount,
        discountAmount,
        total
      };
    });

    const payload = {
      sale: savedSaleId,
      customer: ledgerCustomerId,
      total: ledgerProducts.reduce((sum, p) => sum + p.total, 0),
      products: ledgerProducts,
      markAsPaid: false
    };

    console.log('🧾 Sending to ledger (Add Ledger):', payload);

    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/ledger/sync`, payload);

    toast.success('Ledger entry added successfully');
    resetForm();
  } catch (err) {
    console.error('Error adding ledger:', err);
    toast.error('Failed to add ledger. Check console for details.');
  } finally {
    setShowModal(false);
  }
};

const handleMarkAsPaid = async () => {
  try {
    // Ensure we have a valid customer ID
    let ledgerCustomerId = customerId;
    if (!ledgerCustomerId && newCustomerName.trim()) {
      const newCustomer = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/customers`,
        {
          name: newCustomerName.trim(),
          address: newCustomerAddress.trim(),
          contact: newCustomerContact.trim()
        }
      );
      ledgerCustomerId = newCustomer.data._id;
      setCustomerId(ledgerCustomerId);
    }

    if (!ledgerCustomerId) {
      toast.error('Customer is required for ledger');
      return;
    }

    if (!savedSaleId) {
      toast.error('Sale ID not found');
      return;
    }

    // Prepare products payload
    const ledgerProducts = saleItems.map(item => {
      const productId = typeof item.product === 'string' ? item.product : item.product._id;
      const p = products.find(pr => pr._id === productId);
      const price = p?.price || 0;
      const discount = item.discount || 0;
      const discountAmount = item.discountAmount || (price * discount) / 100;
      const total = (price - discountAmount) * item.quantity;

      return {
        product: productId,
        quantity: item.quantity,
        price,
        discount,
        discountAmount,
        total
      };
    });

    const payload = {
      sale: savedSaleId,
      customer: ledgerCustomerId,
      total: ledgerProducts.reduce((sum, p) => sum + p.total, 0),
      products: ledgerProducts,
      markAsPaid: true
    };

    console.log('🧾 Sending to ledger (Mark as Paid):', payload);

    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/ledger/sync`, payload);

    toast.success('Ledger marked as paid');
    resetForm();
  } catch (err) {
    console.error('Error marking ledger as paid:', err);
    toast.error('Failed to mark ledger as paid. Check console for details.');
  } finally {
    setShowModal(false);
  }
};





  const resetForm = () => {
    setSaleItems([]);
    setCustomerId('');
    setSavedSaleId(null);
    setTotalAmount(0);
    setNewCustomerName('');
    setNewCustomerAddress('');
    setNewCustomerContact('');
  };

  const handleGeneratePDF = () => {
    const element = componentRef.current;
    const opt = {
      margin: 0.3,
      filename: `Invoice_${invoiceNo}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const selectedCustomer = customerId
    ? customers.find(c => c._id === customerId)
    : {
      name: newCustomerName,
      contact: newCustomerContact,
      address: newCustomerAddress,
    };

  return (
    <div className="container mt-4">
      <h2>Sales Billing</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Search or Select Customer</label>
          <Select
            options={customers.map(c => ({
              value: c._id,
              label: `${c.name} - ${c.contact}`
          }))}
          onChange={option => {
            if (option) {
              const selected = customers.find(c => c._id === option.value);
              setCustomerId(option.value);
              setNewCustomerName(selected.name);
              setNewCustomerContact(selected.contact);
              setNewCustomerAddress(selected.address);
            } else {
              setCustomerId('');
              setNewCustomerName('');
              setNewCustomerContact('');
              setNewCustomerAddress('');
            }
         }}
        placeholder="Search customer..."
        isClearable
        />

        </div>

        <div className="mb-3">
          <label className="form-label">Enter New Customer Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter customer name"
            value={newCustomerName}
            onChange={e => {
              setNewCustomerName(e.target.value);
              setCustomerId('');
            }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Customer Contact Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter contact number"
            value={newCustomerContact}
            onChange={e => setNewCustomerContact(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Customer Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter address"
            value={newCustomerAddress}
            onChange={e => setNewCustomerAddress(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Search & Select Product</label>
        <Select
  options={products
    .filter(p => p.quantity > 0)
    .map(p => ({
      value: p._id,
      label: `${p.name} (₹${p.price}) — ${p.quantity} in stock`
    }))
  }
  onChange={option => addItem(option.value)}
  placeholder="Type product name..."
  isClearable
/>


        </div>

        {saleItems.length > 0 && (
          <div className="mb-3">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Rate</th>
<th>Discount (%)</th>
    <th>Discount (₹)</th>
                  <th>Total</th>
                  <th>Action</th>

                </tr>
              </thead>
              
              <tbody>
                {saleItems.map((item, index) => {
                  const product = products.find(p => p._id === item.product);
                  if (!product) return null;

                 // Calculate total for item with discount percentage
                  const discountedPrice = product.price * (1 - ((item.discount || 0) / 100));
                  const itemTotal = discountedPrice * item.quantity;

                  return (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>
                       <input
  type="number"
  min="1"
  max={product.quantity}
  value={item.quantity}
  onChange={(e) => {
    const newQty = Math.min(parseInt(e.target.value) || 1, product.quantity);
    const updatedItems = [...saleItems];
    updatedItems[index].quantity = newQty;
    setSaleItems(updatedItems);
  }}
  className="form-control"
  style={{ width: '80px' }}
/>

                      </td>
                      <td>₹{product.price}</td>
                      
                  <td>
  <div className="d-flex align-items-center">
    <input
      type="number"
      min="0"
      placeholder="%"
      value={item.discount || 0}
      onChange={(e) => {
        const discount = parseFloat(e.target.value) || 0;
        const product = products.find(p => p._id === item.product);
        const price = product?.price || 0;
        const discountAmount = (price * discount) / 100;

        const updatedItems = [...saleItems];
        updatedItems[index].discount = discount;
        updatedItems[index].discountAmount = discountAmount;
        setSaleItems(updatedItems);
      }}
      className="form-control"
      style={{ width: '70px' }}
    />
    <span className="ms-1">%</span>
  </div>
</td>

<td>
  <div className="d-flex align-items-center">
    <input
      type="number"
      min="0"
      placeholder="₹"
      value={item.discountAmount || 0}
      onChange={(e) => {
        const discountAmount = parseFloat(e.target.value) || 0;
        const product = products.find(p => p._id === item.product);
        const price = product?.price || 0;
        const discount = price ? (discountAmount / price) * 100 : 0;

        const updatedItems = [...saleItems];
        updatedItems[index].discountAmount = discountAmount;
        updatedItems[index].discount = discount;
        setSaleItems(updatedItems);
      }}
      className="form-control"
      style={{ width: '70px' }}
    />
    <span className="ms-1">₹</span>
  </div>
</td>



                      <td>₹{itemTotal.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            const updatedItems = saleItems.filter((_, i) => i !== index);
                            setSaleItems(updatedItems);
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

        <h5 className="mt-4">Invoice Preview:</h5>
        <div className="mb-3 border p-3 bg-light">
          <InvoicePreview
            customer={selectedCustomer || {}}
            saleItems={saleItems}
            products={products}
            invoiceNo={invoiceNo}
            totalAmount={totalAmount}
          />
        </div>

        <div style={{ display: 'none' }}>
          <InvoicePreview
            ref={componentRef}
            customer={selectedCustomer || {}}
            saleItems={saleItems}
            products={products}
            invoiceNo={invoiceNo}
            totalAmount={totalAmount}
          />
        </div>

        <div className="d-flex justify-content-center mt-4">
  <button type="submit" className="btn btn-success me-3">Save Sale</button>
  <button type="button" onClick={handleGeneratePDF} className="btn btn-secondary">Download Invoice PDF</button>
</div>

      </form>

      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select Ledger Option</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>How would you like to proceed with the ledger?</p>
                </div>
                <div className="modal-footer">
                  <button onClick={handleAddLedger} className="btn btn-primary">Add Ledger</button>
                  <button onClick={handleMarkAsPaid} className="btn btn-success">Mark as Paid</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default SalesForm;
