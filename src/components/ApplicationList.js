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
const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/applications`);
      console.log("Fetched data:", res.data); // ✅ Check this!
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

  const handleApprove = async (id) => {
    try {
      const res = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/applications/${id}`, { status: 'approved' });
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
  <div className="application-cards">
    {applications.map((app) => (
      <div key={app._id} className={`application-card ${app.status}`}>
        <div className="app-info">
          <p><strong>Name:</strong> {app.name}</p>
          <p><strong>Email:</strong> {app.email}</p>
          <p><strong>Phone:</strong> {app.phone}</p>
          <p><strong>Business:</strong> {app.businessName}</p>
          <p><strong>Message:</strong> {app.message}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge ${app.status}`}>
              {app.status === 'approved' ? 'Approved' : 'Pending'}
            </span>
          </p>
        </div>
        <div className="app-actions">
          <button className="delete-btn" onClick={() => handleDelete(app._id)}>Delete</button>
          {app.status !== 'approved' && (
            <button className="approve-btn" onClick={() => handleApprove(app._id)}>Approve</button>
          )}
        </div>
      </div>
    ))}
  </div>


      )}
    </div>
  );
};

export default ApplicationList;
