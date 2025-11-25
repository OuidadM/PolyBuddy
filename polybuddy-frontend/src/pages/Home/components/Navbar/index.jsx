import React from "react";
import "./Navbar.css";
import logoPolybuddy from "../../assets/logoPolybuddy.png";

export default function Navbar() {
  return (
    <nav className="navbar">
      <img src={logoPolybuddy} alt="logo" />
      <button className="btn">Connexion</button>
    </nav>
  );
}