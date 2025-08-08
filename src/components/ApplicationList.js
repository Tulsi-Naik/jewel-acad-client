// src/components/ApplicationList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ApplicationList.css';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get('/api/applications');
        setApplications(res.data);
      } catch (err) {
        toast.error('Failed to load applications');
      }
    };
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplications(applications.filter((app) => app._id !== id));
      toast.success('Application deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(`/api/applications/${id}`, { status: 'approved' });
      setApplications(applications.map(app => app._id === id ? { ...app, status: 'approved' } : app));
      toast.success('Application approved');
    } catch (err) {
      toast.error('Failed to approve');
    }
  };

  return (
    <div className="application-list-container">
      <h2>Vendor Applications</h2>
      {applications.length === 0 ? (
        <p>No applications received yet.</p>
      ) : (
        <table className="application-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Business</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className={app.status === 'approved' ? 'approved-row' : ''}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.businessName}</td>
                <td>{app.message}</td>
                <td>
                  <span className={`status-badge ${app.status}`}>
                    {app.status === 'approved' ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(app._id)}>Delete</button>
                  {app.status !== 'approved' && (
                    <button className="approve-btn" onClick={() => handleApprove(app._id)}>Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationList;
