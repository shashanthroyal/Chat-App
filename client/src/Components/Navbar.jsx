import React from 'react'
import { useState , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';


function Navbar() {

    const [username , setUsername] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }

        const handleStorageChange = () => {
            const updatedUsername = localStorage.getItem("username");
            setUsername(updatedUsername);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
   
   const handleLogout = () =>{
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("id");
            setUsername(null);
            navigate('/login')
   }
    
  return (
    <div className="navbar">
      <div className="navbar-brand">
        <h2>Chat App</h2>
      </div>
      <div className="navbar-links">
        {username ? (
          <div className="navbar-user-info">
            <p>Hello, {username}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="navbar-auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
