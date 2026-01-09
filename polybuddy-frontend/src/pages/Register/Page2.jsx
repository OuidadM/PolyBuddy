import React, { useState } from "react";
import "./Page2.css";
import { useNavigate, useLocation } from "react-router-dom";

import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";
import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";

/* =========================
   CONFIGURATION PRO
   ========================= */

// Règles par pays (E.164)
const phoneRules = {
  "+33": { min: 9, max: 9, example: "6 12 34 56 78" },
  "+216": { min: 8, max: 8, example: "20 123 456" },
  "+212": { min: 9, max: 9, example: "6 12 34 56 78" },
  "+32": { min: 8, max: 9, example: "470 12 34 56" },
  "+44": { min: 9, max: 10, example: "7 1234 5678" },
  "+49": { min: 7, max: 12, example: "151 23456789" } // Allemagne
};

const countries = Object.keys(phoneRules);

// Code postal : norme internationale raisonnable
// (lettres + chiffres, 3 à 10 caractères)
const POSTAL_REGEX = /^[A-Za-z0-9\s-]{3,10}$/;
// Validation email standard
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


export default function RegisterPhase2() {
  const navigate = useNavigate();
  const { state: page1Data } = useLocation();

  /* =========================
     STATES
     ========================= */
  const [countryCode, setCountryCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ville, setVille] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [rue, setRue] = useState("");
  const [complement, setComplement] = useState("");

  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = () => {
    /* ---- Téléphone ---- */
    if (!countryCode) {
      alert("Veuillez sélectionner un indicatif");
      return;
    }

    let phoneClean = phone.replace(/\D/g, "");

    // Supprimer le 0 national automatiquement
    if (phoneClean.startsWith("0")) {
      phoneClean = phoneClean.slice(1);
    }

    const rule = phoneRules[countryCode];

    if (
      phoneClean.length < rule.min ||
      phoneClean.length > rule.max
    ) {
      alert(
        `Numéro invalide pour ${countryCode}.\n\n` +
        `Format attendu : ${countryCode} ${rule.example}\n` +
        `Ne pas saisir le 0 initial.`
      );
      return;
    }

    /* ---- Email ---- */
    if (!email.trim()) {
      alert("L'email est obligatoire");
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      alert("Veuillez saisir une adresse email valide");
      return;
    }

    /* ---- Adresse ---- */
    if (!ville.trim()) {
      alert("La ville est obligatoire");
      return;
    }

    if (!rue.trim()) {
      alert("La rue est obligatoire");
      return;
    }

    if (!codePostal.trim()) {
      alert("Le code postal est obligatoire");
      return;
    }

    if (!POSTAL_REGEX.test(codePostal.trim())) {
      alert(
        "Code postal invalide.\n" +
        "Exemples valides :\n" +
        "• 75001\n• SW1A 1AA\n• 1000\n• 40000"
      );
      return;
    }

    const formData = {
      ...page1Data, // données Page1
      email: email.trim().toLowerCase(), // ✅ email normalisé
      numero: `${countryCode}${phoneClean}`, // E.164
      address: {
        city: ville.trim(),
        postalCode: codePostal.trim(),
        street: rue.trim(),
        complement: complement.trim() || null
      }
    };

    console.log("Données envoyées vers Page3 :", formData);

    navigate("/register/3", { state: formData });
  };

  return (
    <div className="register-page">
      <img src={Graduate} className="bg-img create-graduate" alt="" />
      <img src={Vector} className="bg-img create-vector" alt="" />

      <h1 className="register-title">Rejoins-nous</h1>

      <img src={Orange} className="create-avatar create-avatar-top-left" alt="" />
      <img src={Vert} className="create-avatar create-avatar-top-right" alt="" />
      <img src={Rose} className="create-avatar create-avatar-bottom-left" alt="" />
      <img src={Mauve} className="create-avatar create-avatar-bottom-right" alt="" />

      <div className="register-form">
        <input
          type="email"
          className="input-field"
          placeholder="Adresse email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <div className="phone-wrapper">
          <select
            className="phone-select"
            value={countryCode}
            onChange={e => setCountryCode(e.target.value)}
          >
            <option value="">Indicatif</option>
            {countries.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>

          <input
            type="tel"
            className="input-field phone-input"
            placeholder="Numéro de téléphone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        <input
          className="input-field"
          placeholder="Ville"
          value={ville}
          onChange={e => setVille(e.target.value)}
        />

        <input
          className="input-field"
          placeholder="Code postal"
          value={codePostal}
          onChange={e => setCodePostal(e.target.value)}
        />

        <input
          className="input-field"
          placeholder="Rue"
          value={rue}
          onChange={e => setRue(e.target.value)}
        />

        <input
          className="input-field"
          placeholder="Complément d'adresse (optionnel)"
          value={complement}
          onChange={e => setComplement(e.target.value)}
        />

        <button className="next-btn" onClick={handleSubmit}>
          Suivant
        </button>
      </div>
    </div>
  );
}
