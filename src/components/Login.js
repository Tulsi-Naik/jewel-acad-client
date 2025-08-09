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
      console.log('📤 Sending login request with:', { username });

      const res = await axios.post(
        'https://jewel-academic-server.onrender.com/api/auth/login',
        { username, password },
        { withCredentials: true }
      );

      console.log('📥 Login API raw response:', res.data);

      const token = res.data.token;
      if (!token) {
        toast.error('No token received from server');
        console.warn('⚠️ No token in server response!');
        return;
      }

      // store token
      localStorage.setItem('token', token);
      console.log('🔑 Token saved to localStorage');

      // decode & save vendor info if vendor
      const decoded = jwtDecode(token);
      console.log('📝 Decoded JWT payload:', decoded);

      const role = decoded.role;

      if (role === 'vendor') {
        const vendorInfo = {
          brandFull: decoded.brandFull,
          brandShort: decoded.brandShort,
          address: decoded.address,
          contact: decoded.contact
        };
        localStorage.setItem('vendorInfo', JSON.stringify(vendorInfo));
        console.log('🏷️ Vendor info saved:', vendorInfo);
      }

      toast.success(`Welcome back, ${decoded.username}!`);

      // IMPORTANT: redirect vendor to /dashboard (not to '/')
      setTimeout(() => {
        // admin -> admin area, vendor -> dashboard
        window.location.href = role === 'admin' ? '/admin' : '/dashboard';
      }, 800);
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
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
        <h2 style={{ marginBottom: '10px', color: '#8B5E3C' }}>
          Welcome back
        </h2>
        <p style={{ marginBottom: '30px', color: '#555' }}>
          Let’s shine today ✨
        </p>

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
