import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user object
      alert(`Welcome ${res.data.user.username} logged in successfully`);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      console.error("Login error:", err);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className='auth-form'>
          {error && <p className="error-message">{error}</p>}
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' placeholder='Enter your email' onChange={handleChange} className='auth-input' required />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' placeholder='Enter your password' onChange={handleChange} className='auth-input' required />
          </div>
          <button type='submit' className='auth-button'>Login</button>
        </form>
        <p> Don't have an account ? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

export default Login;
