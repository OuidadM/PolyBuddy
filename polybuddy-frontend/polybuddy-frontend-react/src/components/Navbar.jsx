import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <header className="nav">
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <Link to="/" style={{fontWeight:700}}>PolyBuddy</Link>
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Create account</Link>
      </nav>
    </header>
  )
}
