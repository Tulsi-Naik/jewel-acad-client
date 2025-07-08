import React, { useState, useEffect, useRef } from 'react';

import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import logoMarathi from '../components/assets/logo-marathi.png';

import { getUserFromToken } from '../utils/auth';
import axios from '../utils/axiosInstance';

const user = getUserFromToken();

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '', quantity: '', price: '', weight: ''
  });
  const [editForm, setEditForm] = useState({
    name: '', quantity: '', price: '', weight: '',  barcode: ''
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [barcodeInfo, setBarcodeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const barcodeRefs = useRef({});
  const [showLabelModal, setShowLabelModal] = useState(false);
const [labelQty, setLabelQty] = useState(1);
const [labelProduct, setLabelProduct] = useState(null);
const [showStockModal, setShowStockModal] = useState(false);
const [stockType, setStockType] = useState('in'); // 'in' or 'out'
const [stockQty, setStockQty] = useState(1);
const [stockNote, setStockNote] = useState('');
const [selectedProduct, setSelectedProduct] = useState(null);
const [showHistoryModal, setShowHistoryModal] = useState(false);
const [stockHistory, setStockHistory] = useState([]);



 const fetchProducts = async () => {
  setLoading(true);
  try {
    const res = await axios.get('/products');
    setProducts(res.data);
    setTimeout(() => {
      res.data.forEach((p) => generateBarcode(p._id));
    }, 100);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, quantity, price } = form;
    if (!name.trim() || quantity <= 0 || price <= 0) {
      return;
    }

    const payload = {
      name: name.trim(),
      quantity: Number(quantity),
      price: Number(price),
      weight: form.weight,
      expiryDate: form.expiryDate,
      manufacturingDate: form.manufacturingDate,
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/products`, payload);
      setForm({ name: '', quantity: '', price: '', weight: '', expiryDate: '', manufacturingDate: '' });
      fetchProducts();
    } catch (err) {
      console.error('Error', err);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditForm({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      weight: product.weight || '',
      expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : '',
      manufacturingDate: product.manufacturingDate ? product.manufacturingDate.split('T')[0] : '',
      barcode: product._id,
    });
    setShowModal(true);
  };

  const openStockModal = (product, type) => {
  setSelectedProduct(product);
  setStockType(type);
  setStockQty(1);
  setStockNote('');
  setShowStockModal(true);
};

const handleStockSubmit = async () => {
  if (!selectedProduct || stockQty <= 0) {
    toast.error("Please enter a valid quantity");
    return;
  }

  try {
    const endpoint = `/products/${selectedProduct._id}/${stockType === 'in' ? 'stockin' : 'stockout'}`;
    const payload = {
      amount: stockQty,
      note: stockNote
    };

    await axios.put(endpoint, payload);
    toast.success(`Stock ${stockType === 'in' ? 'added' : 'removed'} successfully`);

    setShowStockModal(false);
    fetchProducts(); // refresh list
  } catch (err) {
    console.error('Stock update error:', err);
    toast.error(err.response?.data?.message || 'Stock update failed');
  }
};


  const handleSaveEdit = async () => {
    const { name, quantity, price } = editForm;
    if (!name.trim() || quantity <= 0 || price <= 0) {
      return;
    }

    try {
      console.log("Updating product:", editId, editForm);

      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/products/${editId}`, editForm);
      fetchProducts();
      toast.success("Product updated successfully!");

      setShowModal(false);
      setEditId(null);
    } catch (err) {
      console.error('Error', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmation = window.confirm("Are you sure you want to delete this product?");
      if (confirmation) {
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`);
        fetchProducts();
      }
    } catch (err) {
      console.error('Error', err);
    }
  };

  const generateBarcode = (id) => {
    const canvas = barcodeRefs.current[id];
    if (canvas) {
      JsBarcode(canvas, id.toString(), {
        format: "CODE128",
        displayValue: false,
        width: 1,
        height: 20,
        margin: 0,
      });
    }
  };
const openLabelModal = (product) => {
  setLabelProduct(product);
  setLabelQty(product.quantity || 1); // default to current quantity
  setShowLabelModal(true);
};



const generatePDFWithBarcodes = (product, count = 1) => {
  const canvas = barcodeRefs.current[product._id];
  if (!canvas) {
  toast.error("Barcode not ready yet. Please wait a moment.");
  return;
}
if (product.quantity <= 0) {
  toast.error("This product is out of stock. Please update quantity before printing labels.");
  return;
}

  const barcodeImage = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: 'mm', format: 'A4' });

  const pageHeight = 297;
  const margin = 10;
  const rowHeight = 35;
  const startX = margin;
  let currentY = margin;

  const cleanPrice = String(product.price).replace(/[^\d.]/g, "");

  for (let i = 0; i < count; i++) {
    if (currentY + rowHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }

    pdf.setDrawColor(220);
    pdf.rect(startX, currentY, 190, rowHeight);

    const dividerX = startX + 100;
    pdf.line(dividerX, currentY, dividerX, currentY + rowHeight);

    // ✅ Use image directly
pdf.addImage(logoMarathi, 'AUTO', startX + 4, currentY + 6, 50, 9);

    pdf.setFont('helvetica','bold');
pdf.setFontSize(10); // unified font size
pdf.text(product.name, startX + 4, currentY + 21); // slightly lower
pdf.text(`MRP: Rs ${cleanPrice}`, startX + 4, currentY + 27); // consistent spacing

    pdf.addImage(barcodeImage, 'PNG', dividerX + 5, currentY + 6, 75, 20);

    currentY += rowHeight + 5;
  }

  pdf.save(`${product.name}_barcodes.pdf`);
};

  const handleBarcodeScan = async (barcode) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/barcode/${barcode}`);
      setBarcodeInfo(response.data);
    } catch (err) {
      console.error('Error', err);
    }
  };

  const handleExportAllBarcodes = () => {
    products.forEach((p) => generateBarcode(p._id));
    setTimeout(() => {
      products.forEach((p) => generatePDFWithBarcodes(p));
    }, 200);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearch = () => {
    fetchProducts();
  };
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    fetchProducts();
  }, []);

const openHistoryModal = async (productId) => {
  try {
    const res = await axios.get(`/products/stock-history/${productId}`);
    setStockHistory(res.data);
    setShowHistoryModal(true);
  } catch (err) {
    console.error('Error fetching stock history:', err);
  }
};


  return (
    <div className="container mt-4">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2 className="text-center mb-4 text-primary">Add Product</h2>

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
        <h5 className="mb-3 border-bottom pb-2 text-primary">Add New Product</h5>

        <div className="row g-4">
          {/* Product Info */}
          <div className="col-md-4">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Gold Ring"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-control"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 12"
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 60"
              required
            />
          </div>

        

          {/* Submit Button */}
          <div className="col-12 text-end">
            <button className="btn btn-success px-4" type="submit">
              Save Product
            </button>
          </div>
        </div>
      </form>

      <br />



      <div className="d-flex justify-content-between mb-4 p-3 bg-dark rounded shadow-sm">
        <div className="col-md-8">
          <input type="text" className="form-control" value={searchQuery} onChange={handleSearchChange} placeholder="Search Products" />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>Search</button>
        </div>
        <div className="col-md-1">
          <button className="btn btn-danger w-100" onClick={handleClearSearch}>Clear</button>
        </div>
      </div>

      {barcodeInfo && (
        <div className="alert alert-info mt-3">
          <h5>Product Info</h5>
          <p><strong>Manufacturing Date:</strong> {new Date(barcodeInfo.manufacturingDate).toLocaleDateString()}</p>
          <p><strong>Expiry Date:</strong> {new Date(barcodeInfo.expiryDate).toLocaleDateString()}</p>
        </div>
      )}

      <h3 className="text-center mt-5 mb-3">📦 Product List</h3>

      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
<table className="table table-bordered table-hover">
        <thead className="table-dark">
  <tr>
    <th style={{ width: '25%' }}>Name</th>
    <th style={{ width: '10%' }}>Quantity</th>
    <th style={{ width: '15%' }}>Price (₹)</th>
    <th style={{ width: '20%' }}>Barcode</th>
    <th style={{ width: '30%' }}>Actions</th>
  </tr>
</thead>


          <tbody>
            {filteredProducts.map((p) => (
<tr key={p._id} className={p.quantity === 0 ? 'table-danger' : ''}>
                <td>{p.name}</td>
<td>
  {p.quantity === 0 ? (
    <span className="badge bg-danger">Out of Stock</span>
  ) : (
    p.quantity
  )}
</td>
                <td>{p.price}</td>
                <td>
                  <canvas ref={(el) => (barcodeRefs.current[p._id] = el)} style={{ display:'none' }} />
<button className="btn btn-outline-success btn-sm mt-1" onClick={() => openLabelModal(p)}>📄 PDF</button>
                </td>
 <td>
  <div className="d-flex gap-1 flex-nowrap">
    <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(p)}>Edit</button>
    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>Delete</button>
    <button className="btn btn-sm btn-outline-primary" onClick={() => openStockModal(p, 'in')}>Stock In</button>
    <button className="btn btn-sm btn-outline-secondary" onClick={() => openStockModal(p, 'out')}>Stock Out</button>
      <button className="btn btn-sm btn-outline-info" onClick={() => openHistoryModal(p._id)}>History</button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3"><label className="form-label">Name</label><input type="text" className="form-control" name="name" value={editForm.name} onChange={handleEditChange} /></div>
          <div className="mb-3"><label className="form-label">Quantity</label><input type="number" className="form-control" name="quantity" value={editForm.quantity} onChange={handleEditChange} /></div>
          <div className="mb-3"><label className="form-label">Price</label><input type="number" className="form-control" name="price" value={editForm.price} onChange={handleEditChange} /></div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLabelModal} onHide={() => setShowLabelModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Print Barcode Labels</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>How many labels do you want to print for <strong>{labelProduct?.name}</strong>?</p>
    <input
      type="number"
      min="1"
      value={labelQty}
      onChange={(e) => setLabelQty(parseInt(e.target.value) || 1)}
      className="form-control"
    />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowLabelModal(false)}>Cancel</Button>
   <Button variant="primary" onClick={() => {
  setShowLabelModal(false);
  setTimeout(() => {
    generatePDFWithBarcodes(labelProduct, labelQty);
  }, 300); // small delay ensures barcode is ready
}}>
  Generate PDF
</Button>

  </Modal.Footer>
</Modal>
<Modal show={showStockModal} onHide={() => setShowStockModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>{stockType === 'in' ? 'Add Stock' : 'Remove Stock'}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>How many units do you want to {stockType} for <strong>{selectedProduct?.name}</strong>?</p>
    <input
      type="number"
      min="1"
      value={stockQty}
      onChange={(e) => setStockQty(parseInt(e.target.value) || 1)}
      className="form-control mb-3"
    />
    <textarea
      placeholder="Optional note (e.g. Restocked, Sold, Damaged)"
      className="form-control"
      value={stockNote}
      onChange={(e) => setStockNote(e.target.value)}
    />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowStockModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleStockSubmit}>Submit</Button>
  </Modal.Footer>
</Modal>
<Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Stock History</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {stockHistory.length === 0 ? (
      <p>No stock movements found.</p>
    ) : (
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {stockHistory.map((entry) => (
            <tr key={entry._id}>
              <td>{new Date(entry.date).toLocaleDateString()}</td>
              <td>{entry.type}</td>
              <td>{entry.quantity}</td>
              <td>{entry.note || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </Modal.Body>
</Modal>



    </div>


  );

};
export default ProductForm;
