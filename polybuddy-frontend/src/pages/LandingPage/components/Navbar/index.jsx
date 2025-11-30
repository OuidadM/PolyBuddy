import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Import hook
import "./Navbar.css";
import logoPolybuddy from "../../assets/logoPolybuddy.png";

export default function Navbar() {
  const navigate = useNavigate(); // 2. Initialize hook

  return (
    <nav className="navbar">
      <img src={logoPolybuddy} alt="logo" />
      
      {/* 3. On Click, go to /home (which loads the Feed) */}
      <button 
        className="btn" 
        onClick={() => navigate('/home')}
      >
        Connexion
      </button>
    </nav>
  );
}