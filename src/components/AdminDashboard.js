import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';



const AdminDashboard = () => {

  const [vendors, setVendors] = useState([]);

  const [showModal, setShowModal] = useState(false);
const [newVendor, setNewVendor] = useState({
  username: '',
  password: '',
  dbName: ''
});


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

  const handleAddVendor = async () => {
  const { username, password, dbName } = newVendor;
  if (!username || !password || !dbName) {
    alert('All fields are required');
    return;
  }

  try {
    await axios.post('/admin/vendors', { username, password, dbName });
    alert('Vendor added successfully');
    setShowModal(false);
    setNewVendor({ username: '', password: '', dbName: '' });
    fetchVendors(); // refresh list
  } catch (err) {
    console.error('Error adding vendor:', err);
    alert(err.response?.data?.message || 'Failed to add vendor');
  }
};


 return (
  <div className="container mt-4">
    <h2 className="text-primary mb-4">Admin Dashboard – Vendor Management</h2>

    <button className="btn btn-success mb-3" onClick={() => setShowModal(true)}>
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

    {showModal && (
      <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Vendor</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Username"
                value={newVendor.username}
                onChange={(e) => setNewVendor({ ...newVendor, username: e.target.value })}
              />
              <input
                type="password"
                className="form-control mb-2"
                placeholder="Password"
                value={newVendor.password}
                onChange={(e) => setNewVendor({ ...newVendor, password: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="DB Name"
                value={newVendor.dbName}
                onChange={(e) => setNewVendor({ ...newVendor, dbName: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddVendor}>Add Vendor</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

};
export default AdminDashboard;
