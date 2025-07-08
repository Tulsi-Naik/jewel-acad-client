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
      if (!token) {
        toast.error('No token received from server');
        return;
      }

      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === 'vendor') {
        localStorage.setItem('vendorInfo', JSON.stringify({
          businessName: decoded.businessName,
          address: decoded.address,
          contact: decoded.contact
        }));
      }

      toast.success(`Welcome back, ${decoded.username}!`);

      setTimeout(() => {
        window.location.href = role === 'admin' ? '/admin' : '/';
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #fdfcfb, #e2d1c3)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '10px', color: '#8B5E3C' }}>Welcome to अलंकृत</h2>
        <p style={{ marginBottom: '30px', color: '#555' }}>Start your business journey with brilliance ✨</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '6px',
              border: '1px solid #ccc'
            }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#8B5E3C',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
