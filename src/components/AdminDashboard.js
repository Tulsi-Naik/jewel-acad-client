import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';


const exportToCSV = (data, filename = 'vendors.csv') => {
  const headers = ['Username', 'DB Name', 'Role'];
  const rows = data.map(v => [v.username, v.dbName, v.role]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


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
const [vendorStats, setVendorStats] = useState({ total: 0, dbs: 0 });



  const fetchVendors = async () => {
    try {
      const res = await axios.get('/admin/vendors');
setVendors(res.data); // ✅ First update the vendors list

const dbNames = new Set(res.data.map(v => v.dbName));
setVendorStats({ total: res.data.length, dbs: dbNames.size }); // ✅ Then calculate stats

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
    if (!username.trim() || !dbName.trim()) {
  toast.error('Username and DB Name are required');
  return;
}
if (!editVendor && (!password || password.length < 6)) {
  toast.error('Password must be at least 6 characters');
  return;
}


    try {
      if (editVendor) {
        await axios.put(`/admin/vendors/${editVendor._id}`, { username, dbName });
        toast.success('Vendor updated');
      } else {
        await axios.post('/admin/vendors', { username, password, dbName });
        toast.success('Vendor added');
      }

      setShowModal(false);
      setEditVendor(null);
      setNewVendor({ username: '', password: '', dbName: '' });
      fetchVendors();
    } catch (err) {
      console.error('Error saving vendor:', err);
      toast.error(err.response?.data?.message || 'Failed to save vendor');
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await axios.delete(`/admin/vendors/${id}`);
      toast.success('Vendor deleted');
      fetchVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      toast.error('Failed to delete vendor');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Admin Dashboard – Vendor Management</h2>

      
<div className="mb-3 d-flex gap-4">
  <div className="bg-light border rounded p-3">
    <h6 className="text-muted mb-1">Total Vendors</h6>
    <h4 className="text-primary">{vendorStats.total}</h4>
  </div>
  <div className="bg-light border rounded p-3">
    <h6 className="text-muted mb-1">Active Databases</h6>
    <h4 className="text-success">{vendorStats.dbs}</h4>
  </div>
</div>

     <div className="d-flex gap-2 mb-3">
  <button className="btn btn-success" onClick={() => {
    setEditVendor(null);
    setNewVendor({ username: '', password: '', dbName: '' });
    setShowModal(true);
  }}>
    ➕ Add Vendor
  </button>

  <button className="btn btn-outline-primary" onClick={() => exportToCSV(vendors)}>
    📤 Export CSV
  </button>
</div>



      

<table className="table table-bordered" style={{ tableLayout: 'auto', width: '100%' }}>
      <thead className="table-dark">
  <tr>
    <th>Username</th>
    <th>DB Name</th>
    <th>Role</th>
    <th className="text-center">Actions</th>
  </tr>
</thead>

        <tbody>
          {vendors.map(v => (
            <tr key={v._id}>
              <td>{v.username}</td>
              <td>{v.dbName}</td>
              <td>{v.role}</td>
            <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
  <button
    className="btn btn-sm btn-warning me-2"
    onClick={() => {
      setEditVendor(v);
      setShowModal(true);
    }}
  >
    Edit
  </button>
  <button
    className="btn btn-sm btn-danger me-2"
    onClick={() => handleDeleteVendor(v._id)}
  >
    Delete
  </button>
  <button
    className="btn btn-sm btn-outline-secondary"
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
if (!newPassword || newPassword.length < 6) {
  return toast.error('Password must be at least 6 characters');
}
            try {
              await axios.put(`/admin/vendors/${resetVendor._id}/password`, { password: newPassword });
              toast.success('Password updated');
              setResetVendor(null);
              setNewPassword('');
            } catch (err) {
              console.error('Error resetting password:', err);
              toast.error('Failed to reset password');
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
