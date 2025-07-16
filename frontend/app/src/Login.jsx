import React, { useState } from 'react';
import axios from 'axios';

const url = 'http://localhost:8000'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    try {
      const formDetails = new URLSearchParams();
      formDetails.append('username', username);
      formDetails.append('password', password);

      console.log("Login payload:", username, password);

      const res = await axios.post(`${url}/auth/token`, formDetails, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const token = res.data.access_token;
      localStorage.setItem('token', token);

      setError('');
      setSuccess('✅ Login successful!');

      if (onLogin) onLogin(token);
    } catch (error) {
      setError('Invalid username or password');
      setSuccess('');
    }
  };

  return (
    <div>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
