import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {

   
   const [isLogged , setIsLogged] = useState(true)

   const logout = ()=>{
     setIsLogged (false)
   }

  return (
    <div class = "Navbar">
        <div class= "Navbar-left">
            <h2><Link to='/'>Chat Now</Link></h2>
        </div>
        <div className="Navbar-right">
          { isLogged ? (
            <button onClick={logout}>
              Logout
            </button>
          ) : (
            <>
              <a href="/login" >
                Login
              </a>
              <a href="/register" >
                Register
              </a>
            </>
          )}
        </div>
    </div>
  )
}



export default Navbar
