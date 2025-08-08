import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ApplicationList.css';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/applications`);
        if (Array.isArray(res.data)) {
          setApplications(res.data);
        } else {
          toast.error('Invalid data format received from server');
        }
      } catch (err) {
        toast.error('Failed to load applications');
      }
    };

    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/applications/${id}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: res.data.status } : app))
      );
      toast.success(`Application ${status}`);
    } catch (err) {
      toast.error(`Failed to ${status}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/applications/${id}`);
      setApplications(applications.filter((app) => app._id !== id));
      toast.success('Application deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="application-list-container">
      <h2>Vendor Applications</h2>
<div className="filter-tabs">
  {['all', 'pending', 'approved', 'rejected'].map((status) => (
    <button
      key={status}
      className={`filter-tab ${filter === status ? 'active' : ''}`}
      onClick={() => setFilter(status)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </button>
  ))}
</div>

      {applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        
        <div className="application-cards">
{applications
  .filter((app) => filter === 'all' || app.status === filter)
  .map((app) => (
            <div key={app._id} className={`application-card ${app.status}`}>
              <div className="app-info">
                <p><strong>Name:</strong> {app.name}</p>
                <p><strong>Email:</strong> {app.email}</p>
                <p><strong>Phone:</strong> {app.phone}</p>
                <p><strong>Business:</strong> {app.businessName}</p>
                <p><strong>Message:</strong> {app.message}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-badge ${app.status}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </p>
              </div>

              <div className="app-actions">
                {app.status !== 'approved' && (
                  <button className="approve-btn" onClick={() => updateStatus(app._id, 'approved')}>
                    Approve
                  </button>
                )}
                {app.status !== 'rejected' && (
                  <button className="reject-btn" onClick={() => updateStatus(app._id, 'rejected')}>
                    Reject
                  </button>
                )}
                <button className="delete-btn" onClick={() => handleDelete(app._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
