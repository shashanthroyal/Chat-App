import React from 'react'


function App() {
  const token = localStorage.getItem("token");

  if(!token) return <p>Please login to acess chat</p>

  return <h1>Welcome to Chat Dashboard</h1>

}

export default App
