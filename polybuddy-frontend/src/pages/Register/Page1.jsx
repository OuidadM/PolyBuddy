import React, { useState } from "react";
import "./Page1.css";

import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";

import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";

import Profile from "../Home/assets/Profile (1).png";

export default function CreateAccount() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const years = Array.from({ length: 90 }, (_, i) => 2025 - i);

  return (
    <div className="create-container">

      {/* BACKGROUND */}
      <img src={Graduate} className="bg-img create-graduate" alt="" />
      <img src={Vector} className="bg-img create-vector" alt="" />

      {/* TITLE ABOVE THE CARD */}
      <h1 className="create-title">Rejoins-nous</h1>

      {/* AVATARS */}
      <img src={Orange} className="create-avatar create-avatar-top-left" alt="" />
      <img src={Vert} className="create-avatar create-avatar-top-right" alt="" />
      <img src={Rose} className="create-avatar create-avatar-bottom-left" alt="" />
      <img src={Mauve} className="create-avatar create-avatar-bottom-right" alt="" />

      {/* FORM CARD */}
      <div className="form-card">

        <label>Prénom</label>
        <input type="text" placeholder="Votre prénom" />

        <label>Nom</label>
        <input type="text" placeholder="Votre nom" />

        <label>Date de naissance</label>
        <div className="birth-selects">
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option>-- jour --</option>
            {days.map((d) => <option key={d}>{d}</option>)}
          </select>

          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option>-- mois --</option>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option>-- année --</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>

        <label>Nom utilisateur</label>
        <div className="username-input-group">
          <img src={Profile} className="username-input-icon" alt="" />
          <input type="text" placeholder="Choisissez un username" />
        </div>

        <label>Spécialité</label>
        <select>
          <option value="">-- Sélectionnez une spécialité --</option>
          <option value="SAGI">SAGI</option>
          <option value="QIFF">QIFF</option>
          <option value="BAT">BAT</option>
          <option value="GBS">GBS</option>
          <option value="PEIP">PEIP</option>
        </select>

        <div className="toggle-container">
          <span>International</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
          <span>Bénévole</span>
        </div>

        <button className="submit-btn">Suivant</button>
      </div>
    </div>
  );
}
