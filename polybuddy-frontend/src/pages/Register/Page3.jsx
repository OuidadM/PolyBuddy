import React, { useState } from "react";
import "./Page3.css"; 

import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";

import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";

import interests from "../../data/interests";

export default function RegisterPhase2() {
  const [formData, setFormData] = useState({
    niveau: "",
    nationalite: "",
    langue: "",
    interests: [],
  });

  const handleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const niveaux = [
    "PEIP1",
    "PEIP2",
    "3A",
    "4A",
    "5A",
    
  ];

  const nationalites = [
    "Algérienne", "Française", "Marocaine", "Tunisienne",
    "Italienne", "Espagnole", "Portugaise", "Autre"
  ];

  const langues = [
    "Français", "Anglais", "Arabe", "Espagnol",
    "Allemand", "Italien", "Chinois", "Autre"
  ];

  return (
    <div className="create-container">

      {/* BACKGROUND */}
      <img src={Graduate} className="bg-img create-graduate" alt="" />
      <img src={Vector} className="bg-img create-vector" alt="" />

      {/* TITLE */}
      <h1 className="create-title">Rejoins-nous</h1>

      {/* AVATARS */}
      <img src={Orange} className="create-avatar create-avatar-top-left" alt="" />
      <img src={Vert} className="create-avatar create-avatar-top-right" alt="" />
      <img src={Rose} className="create-avatar create-avatar-bottom-left" alt="" />
      <img src={Mauve} className="create-avatar create-avatar-bottom-right" alt="" />

      {/* FORM */}
      <div className="form-card">

        <label>Niveau</label>
        <select
          value={formData.niveau}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, niveau: e.target.value }))
          }
        >
          <option value="">-- Sélectionner un niveau --</option>
          {niveaux.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>

        <label>Nationalité</label>
        <select
          value={formData.nationalite}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nationalite: e.target.value }))
          }
        >
          <option value="">-- Votre nationalité --</option>
          {nationalites.map((nat) => (
            <option key={nat}>{nat}</option>
          ))}
        </select>

        <label>Langue parlée</label>
        <select
          value={formData.langue}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, langue: e.target.value }))
          }
        >
          <option value="">-- Langue principale --</option>
          {langues.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>

        <label>Centres d’intérêts</label>
        <div className="interests-box">
          {interests.map((interest) => (
            <label key={interest} className="interest-item">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleInterest(interest)}
              />
              <span>{interest}</span>
            </label>
          ))}
        </div>

        <button className="submit-btn">Suivant</button>

      </div>
    </div>
  );
}
