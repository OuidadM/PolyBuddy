import React from 'react';
import './Clouds.css';
import { useNavigate } from "react-router-dom"; 
import cloudsImage from "../../assets/clouds.png"; 

export default function Clouds() {
  const navigate = useNavigate();
  return (
    <div className="cloud-section">
      <img src={cloudsImage} alt="clouds" /> 
      <div className="cloud-frame">
        <h2>Rejoins nous</h2>
        <button className="btn big-btn" onClick={() => navigate('/register')}>S'inscrire</button>
      </div>
    </div>
  );
}