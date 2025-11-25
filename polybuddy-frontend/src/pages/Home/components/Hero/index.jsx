import React from "react";
import "./Hero.css";
import welcomeImage from "../../assets/welcome.png";

export default function Hero() {
  return (
    <div className="hero">
      <img src={welcomeImage} alt="welcome" />
    </div>
  );
}