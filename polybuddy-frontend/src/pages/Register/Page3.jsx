import React, { useState } from "react";
import "./Page3.css";

import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";
import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";

import interests from "../data/interests.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function RegisterPhase3() {
  const navigate = useNavigate();
  const { state: previousData } = useLocation(); // 👈 Page1 + Page2

  const [formData, setFormData] = useState({
    nationalite: "",
    langue: "",
    interests: [],
    num_etudiant: ""
  });


  /* =========================
     HANDLERS
     ========================= */
  const handleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = () => {
    const isAlumni = previousData?.role === "alumni";
    const num = formData.num_etudiant;

    /* =========================
      VALIDATION NUM ÉTUDIANT
      ========================= */
    if (isAlumni) {
      if (!num) {
        alert("Le numéro étudiant est obligatoire pour les lauréats");
        return;
      }
    }

    if (num) {
      if (!/^\d+$/.test(num)) {
        alert("Le numéro étudiant doit contenir uniquement des chiffres");
        return;
      }

      if (num.length < 6 || num.length > 9) {
        alert("Le numéro étudiant doit contenir entre 6 et 9 chiffres");
        return;
      }
    }

    if (!formData.nationalite) {
      alert("Veuillez sélectionner une nationalité");
      return;
    }

    if (!formData.langue) {
      alert("Veuillez sélectionner une langue");
      return;
    }

    if (formData.interests.length < 3) {
      alert("Veuillez sélectionner au moins 3 centres d'intérêts");
      return;
    }

    /* ---- Fusion finale ---- */
    const data = {
      ...previousData,
      nationalite: formData.nationalite,
      langue: formData.langue,
      centres_interet: formData.interests,
      num_etudiant: formData.num_etudiant || null
    };

    console.log("📦 Données finales d'inscription :",data);

    /* ---- Routing par rôle ---- */
    if (previousData?.role === "alumni") {
      navigate("/register/alumni", { state: data });
    } else {
      navigate("/register/student", { state: data });
    }
  };

  /* =========================
     OPTIONS
     ========================= */
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
      <img src={Graduate} className="bg-img create-graduate" alt="" />
      <img src={Vector} className="bg-img create-vector" alt="" />

      <h1 className="register-title">Rejoins-nous</h1>

      <img src={Orange} className="create-avatar create-avatar-top-left" alt="" />
      <img src={Vert} className="create-avatar create-avatar-top-right" alt="" />
      <img src={Rose} className="create-avatar create-avatar-bottom-left" alt="" />
      <img src={Mauve} className="create-avatar create-avatar-bottom-right" alt="" />

      <div className="form-card">
        <label>Nationalité</label>
        <select
          value={formData.nationalite}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, nationalite: e.target.value }))
          }
        >
          <option value="">-- Votre nationalité --</option>
          {nationalites.map((n) => <option key={n}>{n}</option>)}
        </select>

        <label>Langue parlée</label>
        <select
          value={formData.langue}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, langue: e.target.value }))
          }
        >
          <option value="">-- Langue principale --</option>
          {langues.map((l) => <option key={l}>{l}</option>)}
        </select>
        
        <label>Numéro étudiant</label>
        <input
          type="text"
          placeholder={
            previousData?.role === "alumni"
              ? "Numéro étudiant (obligatoire)"
              : "Numéro étudiant (optionnel)"
          }
          value={formData.num_etudiant}
          onChange={(e) => {
            // autoriser seulement les chiffres
            const value = e.target.value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, num_etudiant: value }));
          }}
        />


        <label>Centres d'intérêts</label>
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

        <button className="submit-btn" onClick={handleSubmit}>
          Suivant
        </button>

      </div>
    </div>
  );
}
