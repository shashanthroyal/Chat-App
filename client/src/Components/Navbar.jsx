import React, { useState , useEffect } from 'react'
import { Link, useNavigate , useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {

  const navigate = useNavigate() 
  const location = useLocation()
   const [isLogged , setIsLogged] = useState(false)

   useEffect(()=>{
    const checkLoginStatus = () => {
      setIsLogged(!!localStorage.getItem("token"));
    };

    checkLoginStatus(); // Initial check

    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
   } , [location.pathname]) // location.pathname is still useful for direct navigation or URL changes

   const logout = ()=>{
     localStorage.removeItem("token")
     setIsLogged (false) // Optimistically update state, storage event will confirm
     navigate("/login")
   }

  return (
    <div class = "Navbar">
        <div class= "Navbar-left">
            <h2><Link to='/chat'>Chat Now</Link></h2>
        </div>
        <div className="Navbar-right">
          { isLogged ? (
            
            <button onClick={logout}>
              Logout
            </button>
          )
            
           : (
            <>
              <Link to="/login" >
                Login
              </Link>
              <Link to="/register" >
                Register
              </Link>
            </>
          )}
        </div>
    </div>
  )
}



export default Navbar
