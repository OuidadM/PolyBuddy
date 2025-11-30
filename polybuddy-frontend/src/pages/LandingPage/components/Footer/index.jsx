import React from "react";
import "./Footer.css";
import logoPolytech from "../../assets/logoPolytech.png";
import logoUnivAngers from "../../assets/logoUnivAngers.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="frame">
        <p>© 2026 Polytech, 4A SAGI</p>
        <div className="footer-logos">
          <img src={logoPolytech} alt="logo Polytech" />
          <img src={logoUnivAngers} alt="logo Université d'Angers" />
        </div>
      </div>
    </footer>
  );
}