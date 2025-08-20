// src/components/InvoicePreview.js
import React, { forwardRef } from 'react';

const vendor = JSON.parse(localStorage.getItem('vendorInfo') || '{}');

const InvoicePreview = forwardRef(({ customer = {}, saleItems = [], invoiceNo = '', totalAmount = 0 }, ref) => {
  // Calculate total using saleItems' own priceAtSale and discountAmount
  const total = saleItems.reduce((sum, item) => {
    const price = Number(item.priceAtSale || 0);
    const discountAmount = Number(item.discountAmount || 0);
    const lineTotal = (price - discountAmount) * item.quantity;
    return sum + lineTotal;
  }, 0);

  const date = new Date();
  const currentDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

  return (
    <div
      ref={ref}
      className="invoice-print border p-4 bg-white d-flex flex-column"
      style={{ width: '100%', fontFamily: 'Arial', color: '#000', minHeight: '850px' }}
    >
      {/* Company Header */}
      <div className="text-center mb-4">
        <h3 className="mt-2">{vendor.brandFull || 'Jewel Hub'}</h3>
        <p>Address: {vendor.address || 'Default address'}</p>
        <p>Contact: {vendor.contact || 'Default contact'}</p>
        <hr />
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div>
          <strong>Customer:</strong> {customer.name || '-'}<br />
          <strong>Contact:</strong> {customer.contact || '-'}
        </div>
        <div>
          <strong>Date:</strong> {currentDate}<br />
          <strong>Invoice No:</strong> {invoiceNo || '-'}
        </div>
      </div>

      <table className="table table-bordered" style={{ border: '1px solid #000' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Discount (%)</th>
            <th>Discount (₹)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {saleItems.map(item => (
            <tr key={item.product}>
              <td>{item.name || 'Product'}</td>
              <td>{item.quantity}</td>
              <td>₹{(item.priceAtSale || 0).toFixed(2)}</td>
              <td>{item.discount > 0 ? `${item.discount.toFixed(1)}%` : '—'}</td>
              <td>{item.discountAmount > 0 ? `₹${item.discountAmount.toFixed(2)}` : '—'}</td>
              <td>₹{((item.priceAtSale || 0) - (item.discountAmount || 0)) * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Spacer */}
      <div style={{ flexGrow: 1 }} />

      {/* Total */}
      <div className="text-end mt-3">
        <h5><strong>Total Amount: ₹{total.toFixed(2)}</strong></h5>
      </div>

      <p className="text-center mt-3">Thank you for shopping with us!</p>
    </div>
  );
});

export default InvoicePreview;
