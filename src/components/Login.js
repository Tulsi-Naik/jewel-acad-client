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

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error('Token decode failed:', err);
      toast.error('Invalid token received');
      return;
    }

    const role = decoded.role;

    if (role === 'vendor') {
      localStorage.setItem('vendorInfo', JSON.stringify({
        businessName: decoded.businessName,
        address: decoded.address,
        contact: decoded.contact
      }));
    }

    toast.success(`Login successful as ${role}`);

    setTimeout(() => {
      window.location.href = role === 'admin' ? '/admin' : '/';
    }, 1000);
  } catch (err) {
    console.error('Login error:', err);
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
