import React, { useState } from "react";
import "./Student.css";
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

export default function RegisterStudent() {
  const navigate = useNavigate();
  const { state: previousData } = useLocation();

  /* =========================
     STATES
     ========================= */
  const [niveau, setNiveau] = useState("");
  const [emailUniv, setEmailUniv] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [justificatifFile, setJustificatifFile] = useState(null);

  const niveaux = [
  { label: "PEIP1", value: 1 },
  { label: "PEIP2", value: 2 },
  { label: "3A", value: 3 },
  { label: "4A", value: 4 },
  { label: "5A", value: 5 }
];


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

    setJustificatifFile(file);
  };

  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = async () => {
    const birthDate = previousData?.dateNaissance || "";

    if (!niveau) {
      alert("Veuillez sélectionner un niveau");
      return;
    }

    // 🔐 Mot de passe
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

    // 📎 Email OU justificatif obligatoire
    if (!justificatifFile && !emailUniv.trim()) {
      alert(
        "Veuillez renseigner soit votre email universitaire, soit importer un justificatif"
      );
      return;
    }

    /* =========================
       PAYLOAD JSON
       ========================= */
    const payload = {
      ...previousData,
      niveau,
      pass: password,
      mail_univ: emailUniv.trim() || null
    };

    /* =========================
       MULTIPART DATA
       ========================= */
    const multipartData = new FormData();
    multipartData.append(
      "data",
      JSON.stringify(payload)
    );

    if (justificatifFile) {
      multipartData.append("justificatif", justificatifFile);
    }

    try {
      const response = await authService.register(multipartData );
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
      };
    }
  return (
    <div className="register-page">
      <img src={Graduate} className="bg-img create-graduate" alt="" />
      <img src={Vector} className="bg-img create-vector" alt="" />

      <h1 className="register-title">Rejoins-nous</h1>

      <img src={Orange} className="create-avatar create-avatar-top-left" alt="" />
      <img src={Vert} className="create-avatar create-avatar-top-right" alt="" />
      <img src={Rose} className="create-avatar create-avatar-bottom-left" alt="" />
      <img src={Mauve} className="create-avatar create-avatar-bottom-right" alt="" />

      <div className="access-form">
        <select
          value={niveau}
          onChange={(e) => setNiveau(Number(e.target.value))}
        >
          <option value="">-- Sélectionner votre niveau --</option>
          {niveaux.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>


        <input
          type="email"
          className="input-field"
          placeholder="Email universitaire"
          value={emailUniv}
          onChange={(e) => setEmailUniv(e.target.value)}
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
          placeholder="Confirmez le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="separator-line">
          <div className="line"></div>
          <span>OU</span>
          <div className="line"></div>
        </div>

        <label className="file-upload">
          <img src={Attach} className="attach-icon" alt="attach" />
          <span>
            {justificatifFile
              ? justificatifFile.name
              : "Importer votre lettre d'admission"}
          </span>
          <input type="file" hidden onChange={handleFileChange} />
        </label>

        <p className="formats">
          Formats acceptés : PDF, PNG, JPG — Taille max : 5 Mo
        </p>

        <button className="next-btn" onClick={handleSubmit}>
          Valider
        </button>
      </div>
    </div>
  );
}
