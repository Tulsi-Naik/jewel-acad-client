import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
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

  const handleSaveEdit = async () => {
    const { name, quantity, price } = editForm;
    if (!name.trim() || quantity <= 0 || price <= 0) {
      return;
    }

    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/products/${editId}`, editForm);
      fetchProducts();
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

  const generatePDFWithBarcodes = (product) => {
  const canvas = barcodeRefs.current[product._id];
  if (!canvas || product.quantity <= 0) return;

  const barcodeImage = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: 'mm', format: 'A4' });

  const pageHeight = 297;
  const margin = 10;
  const rowHeight = 35;
  const startX = margin;
  let currentY = margin;

  const cleanPrice = String(product.price).replace(/[^\d.]/g, "");

  for (let i = 0; i < product.quantity; i++) {
    if (currentY + rowHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }

    // Draw row border
    pdf.setDrawColor(220);
    pdf.rect(startX, currentY, 190, rowHeight);

    // Name and Price (left side)
    pdf.setFontSize(10);
    pdf.text(`Name: ${product.name}`, startX + 4, currentY + 10);
    pdf.text(`Price: Rs.${cleanPrice}`, startX + 4, currentY + 18);

    // Barcode (right side)
    pdf.addImage(barcodeImage, 'PNG', startX + 110, currentY + 6, 80, 20);

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
              <th>Name</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
              <th style={{ width: '140px' }}>Barcode</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.price}</td>
                <td>
                  <canvas ref={(el) => (barcodeRefs.current[p._id] = el)} style={{ maxWidth: '100%', transform: 'scale(0.85)', transformOrigin: 'left center' }} />
                  <button className="btn btn-outline-success btn-sm mt-1" onClick={() => generatePDFWithBarcodes(p)}>📄 PDF</button>
                </td>
                <td>
                  <div className="d-flex gap-1">
                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
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
    </div>
  );
};

export default ProductForm;
