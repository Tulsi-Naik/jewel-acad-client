import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    try {
      const res = await axios.get('/admin/vendors');
      setVendors(res.data);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Admin Dashboard – Vendor Management</h2>
      <button className="btn btn-success mb-3" onClick={() => alert('Show Add Vendor Modal')}>
        ➕ Add Vendor
      </button>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>DB Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(v => (
            <tr key={v._id}>
              <td>{v.username}</td>
              <td>{v.dbName}</td>
              <td>{v.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
