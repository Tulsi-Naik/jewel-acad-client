import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [newVendor, setNewVendor] = useState({
    username: '',
    password: '',
    dbName: ''
  });
  const [resetVendor, setResetVendor] = useState(null);
const [newPassword, setNewPassword] = useState('');


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

  useEffect(() => {
    if (editVendor) {
      setNewVendor({
        username: editVendor.username,
        password: '',
        dbName: editVendor.dbName
      });
    }
  }, [editVendor]);

  const handleSaveVendor = async () => {
    const { username, password, dbName } = newVendor;
    if (!username || !dbName || (!editVendor && !password)) {
      alert('All fields are required');
      return;
    }

    try {
      if (editVendor) {
        await axios.put(`/admin/vendors/${editVendor._id}`, { username, dbName });
        alert('Vendor updated');
      } else {
        await axios.post('/admin/vendors', { username, password, dbName });
        alert('Vendor added');
      }

      setShowModal(false);
      setEditVendor(null);
      setNewVendor({ username: '', password: '', dbName: '' });
      fetchVendors();
    } catch (err) {
      console.error('Error saving vendor:', err);
      alert(err.response?.data?.message || 'Failed to save vendor');
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await axios.delete(`/admin/vendors/${id}`);
      alert('Vendor deleted');
      fetchVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      alert('Failed to delete vendor');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Admin Dashboard – Vendor Management</h2>

      <button className="btn btn-success mb-3" onClick={() => {
        setEditVendor(null);
        setNewVendor({ username: '', password: '', dbName: '' });
        setShowModal(true);
      }}>
        ➕ Add Vendor
      </button>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>DB Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(v => (
            <tr key={v._id}>
              <td>{v.username}</td>
              <td>{v.dbName}</td>
              <td>{v.role}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setEditVendor(v);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteVendor(v._id)}
                >
                  Delete
                </button>
                <button
  className="btn btn-outline-secondary btn-sm me-2"
  onClick={() => {
    setResetVendor(v);
    setNewPassword('');
  }}
>
  Reset Password
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editVendor ? 'Edit Vendor' : 'Add New Vendor'}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowModal(false);
                  setEditVendor(null);
                  setNewVendor({ username: '', password: '', dbName: '' });
                }}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Username"
                  value={newVendor.username}
                  onChange={(e) => setNewVendor({ ...newVendor, username: e.target.value })}
                />
                {!editVendor && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    value={newVendor.password}
                    onChange={(e) => setNewVendor({ ...newVendor, password: e.target.value })}
                  />
                )}
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="DB Name"
                  value={newVendor.dbName}
                  onChange={(e) => setNewVendor({ ...newVendor, dbName: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => {
                  setShowModal(false);
                  setEditVendor(null);
                  setNewVendor({ username: '', password: '', dbName: '' });
                }}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveVendor}>
                  {editVendor ? 'Update Vendor' : 'Add Vendor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {resetVendor && (
  <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Reset Password for {resetVendor.username}</h5>
          <button type="button" className="btn-close" onClick={() => setResetVendor(null)}></button>
        </div>
        <div className="modal-body">
          <input
            type="password"
            className="form-control"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setResetVendor(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={async () => {
            if (!newPassword) return alert('Password is required');
            try {
              await axios.put(`/admin/vendors/${resetVendor._id}/password`, { password: newPassword });
              alert('Password updated');
              setResetVendor(null);
              setNewPassword('');
            } catch (err) {
              console.error('Error resetting password:', err);
              alert('Failed to reset password');
            }
          }}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
};

export default AdminDashboard;
