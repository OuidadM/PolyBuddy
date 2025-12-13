import React, { useState } from "react";
import "./CreateAccount.css";

export default function CreateAccount() {
  // --- State for birth date ---
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Generate days, months, years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const years = Array.from({ length: 90 }, (_, i) => 2025 - i);

  return (
    <div className="page-container">
      {/* Background images */}
      <img src="/avatars/Mauve.png" className="avatar avatar-top-left" alt="" />
      <img src="/avatars/Orange.png" className="avatar avatar-top-right" alt="" />
      <img src="/avatars/Vert.png" className="avatar avatar-bottom-left" alt="" />
      <img src="/avatars/Rose.png" className="avatar avatar-bottom-right" alt="" />

      {/* Title */}
      <h1 className="page-title">Rejoins<br />nous</h1>

      {/* Form container */}
      <div className="form-card">
        <label>Prénom</label>
        <input type="text" placeholder="Votre prénom" />

        <label>Nom</label>
        <input type="text" placeholder="Votre nom" />

        <label>Date de naissance</label>
        <div className="birth-selects">
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option value="">-- jour --</option>
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">-- mois --</option>
            {months.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">-- année --</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <label>Nom utilisateur</label>
        <input type="text" placeholder="Choisissez un username" />

        <label>Spécialité</label>
        <input type="text" placeholder="Spécialité" />

        {/* Toggle */}
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
