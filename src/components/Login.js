import React, { useState } from 'react';
import axios from 'axios';
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

    alert('Login successful!');
    // We'll redirect based on role in the next step
  } catch (err) {
    alert('Login failed. Please check your credentials.');
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
