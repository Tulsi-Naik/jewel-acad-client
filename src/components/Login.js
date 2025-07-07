import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://jewellery-backend-7st1.onrender.com/api/auth/login', {
        username,
        password
      });

      const token = res.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      // ✅ Store vendor branding info
      if (role === 'vendor') {
        localStorage.setItem('vendorInfo', JSON.stringify({
          businessName: decoded.businessName,
          address: decoded.address,
          contact: decoded.contact
        }));
      }

      toast.success(`Login successful as ${role}`);

      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }, 1000);
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%' }}
        />
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;
