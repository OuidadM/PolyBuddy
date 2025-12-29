import React, { useState } from "react";
import "./Alumni.css";
import { useLocation, useNavigate } from "react-router-dom";

// IMAGES
import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";
import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";
import Attach from "../Home/assets/Attach.png";

// SERVICE
import authService from "../../services/auth.service";

export default function RegisterAlumni() {
  const navigate = useNavigate();
  const { state: previousData } = useLocation(); 

  /* =========================
     STATES
     ========================= */
  const [graduationYear, setGraduationYear] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [diplomaFile, setDiplomaFile] = useState(null);

  /* =========================
     YEARS
     ========================= */
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 1980; y--) {
    years.push(y);
  }

  /* =========================
     FILE HANDLER
     ========================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Format invalide. PDF, PNG ou JPG uniquement.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Fichier trop volumineux (max 5 Mo).");
      return;
    }

    setDiplomaFile(file);
  };

  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = async () => {
    if (!graduationYear) {
      alert("Veuillez renseigner l'année d'obtention du diplôme");
      return;
    }

    if (position.trim().length < 2) {
      alert("Veuillez renseigner votre position");
      return;
    }

    if (company.trim().length < 2) {
      alert("Veuillez renseigner votre entreprise");
      return;
    }
    
    const birthDate = previousData?.dateNaissance || "";

    if (password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      alert("Le mot de passe doit contenir des lettres et des chiffres");
      return;
    }

    if (birthDate && password.includes(birthDate.split("-")[0])) {
      alert("Le mot de passe ne doit pas contenir votre année de naissance");
      return;
    }

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (!diplomaFile) {
      alert("Veuillez importer votre diplôme");
      return;
    }

    /* =========================
       PAYLOAD FINAL
       ========================= */
    const payload = {
      ...previousData,
      pass:password,
      annee_diplome:graduationYear,
      position: position.trim(),
      entreprise: company.trim(),
    };

    console.log("📦 Données Alumni (JSON) :", payload);
    console.log("📎 Fichier diplôme :", diplomaFile);

    /* =========================
       FORM DATA (JSON + FILE)
       ========================= */
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    formData.append("justificatif", diplomaFile);

    try {
      const response = await authService.register(formData);
      navigate("/register/success", {
        state: {
          message: response.message
        }
      });
    } catch (error) {
      console.error("Erreur inscription :", error);

      if (error?.error) {
        alert(error.error);
      } else {
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
}

  };

  return (
    <div className="acces-container">
      <img src={Graduate} className="bg-img create-graduate" alt="" />
      <img src={Vector} className="bg-img create-vector" alt="" />

      <h1 className="register-title">Rejoins-nous</h1>

      <img src={Orange} className="create-avatar create-avatar-top-left" alt="" />
      <img src={Vert} className="create-avatar create-avatar-top-right" alt="" />
      <img src={Rose} className="create-avatar create-avatar-bottom-left" alt="" />
      <img src={Mauve} className="create-avatar create-avatar-bottom-right" alt="" />

      <div className="acces-box">
        <select
          className="input-field"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
        >
          <option value="">Année d'obtention du diplôme</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <input
          type="text"
          className="input-field"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <input
          type="text"
          className="input-field"
          placeholder="Entreprise"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          type="password"
          className="input-field"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="input-field"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="separator-line">
          <div className="line"></div>
          <span>Justificatif requis</span>
          <div className="line"></div>
        </div>

        <label className="file-upload">
          <img src={Attach} className="attach-icon" alt="attach" />
          <span>{diplomaFile ? diplomaFile.name : "Importer votre diplôme"}</span>
          <input type="file" hidden onChange={handleFileChange} />
        </label>

        <p className="formats">
          Formats acceptés : PDF, PNG, JPG — Taille max : 5 Mo
        </p>

        <button className="next-btn" onClick={handleSubmit}>
          Valider l'inscription
        </button>
      </div>
    </div>
  );
}
