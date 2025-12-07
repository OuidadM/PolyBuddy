import React from "react";
import "./Feature.css";

export default function Feature({ title, subtitle, image }) {
  return (
    <div className="feature">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      <div>
        <img src={image} alt={title} /> 
      </div>
    </div>
  );
}