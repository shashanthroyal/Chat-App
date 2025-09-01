import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Auth.css';

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Registration Failed"); // Use message from backend
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" onChange={handleChange} className="auth-input" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" onChange={handleChange} className="auth-input" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" onChange={handleChange} className="auth-input" required />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
        <p>Already have an account ? <a href="/login">Login</a> </p>
      </div>
    </div>
  );
}

export default Register;
