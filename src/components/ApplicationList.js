// src/components/ApplicationList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ApplicationList.css'; // We'll add this below

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);

  // Fetch applications from backend
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.businessName}</td>
                <td>{app.message}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(app._id)}>
                    Delete
                  </button>
                  {/* Future: Add approve/reject */}
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
