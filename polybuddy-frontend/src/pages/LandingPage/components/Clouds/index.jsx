import React from 'react';
import './Clouds.css';
import cloudsImage from "../../assets/clouds.png"; 

export default function Clouds() {
  return (
    <div className="cloud-section">
      <img src={cloudsImage} alt="clouds" /> 
      <div className="cloud-frame">
        <h2>Rejoins nous</h2>
        <button className="btn big-btn">S'inscrire</button>
      </div>
    </div>
  );
}