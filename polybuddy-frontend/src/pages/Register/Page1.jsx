import React, { useState } from "react";
import "./Page1.css";
import { useNavigate } from "react-router-dom";

import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";
import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";

export default function RegisterPhase1() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUsername] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [isVolunteer, setIsVolunteer] = useState(false);

  const months = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];

  /* ============================
     VALIDATION + SUBMIT
     ============================ */
  const handleSubmit = () => {

    /* ---- Nom & prénom ---- */
    if (firstName.trim().length < 2) {
      alert("Le prénom doit contenir au moins 2 caractères");
      return;
    }

    if (lastName.trim().length < 2) {
      alert("Le nom doit contenir au moins 2 caractères");
      return;
    }

    /* ---- Date de naissance ---- */
    if (!day || !month || !year) {
      alert("Date de naissance invalide");
      return;
    }

    const monthIndex = months.indexOf(month);
    const birthDateObj = new Date(year, monthIndex, day);

    if (isNaN(birthDateObj.getTime())) {
      alert("Date de naissance incorrecte");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    if (age < 16) {
      alert("Vous devez avoir au moins 16 ans");
      return;
    }

    /* ---- Username ---- */
    if (username.trim().length < 4) {
      alert("Le nom utilisateur doit contenir au moins 4 caractères");
      return;
    }

    /* ---- Spécialité ---- */
    if (!specialty) {
      alert("Veuillez sélectionner une spécialité");
      return;
    }

    /* ---- Date au format STRING (YYYY-MM-DD) ---- */
    const birthDateString =
  `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    /* ---- Payload ---- */
    const formData = {
      prenom: firstName.trim(),
      nom: lastName.trim(),
      genre: gender,
      dateNaissance: birthDateString,   // STRING ✔
      username: username.trim(),
      specialite: specialty.toLowerCase(),
      role: isVolunteer ? "alumni" : "student"
    };
    console.log("données envoyées : ", formData)
    navigate("/register/2", { state: formData });
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

        <label>Prénom</label>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />

        <label>Nom</label>
        <input value={lastName} onChange={e => setLastName(e.target.value)} />

        <label>Genre</label>
        <div className="gender-group">
          <label className="radio-item">
            <input
              type="radio"
              name="gender"
              value="M"
              checked={gender === "M"}
              onChange={(e) => setGender(e.target.value)}
            />
            <span>Homme</span>
          </label>

          <label className="radio-item">
            <input
              type="radio"
              name="gender"
              value="F"
              checked={gender === "F"}
              onChange={(e) => setGender(e.target.value)}
            />
            <span>Femme</span>
          </label>

          <label className="radio-item">
            <input
              type="radio"
              name="gender"
              value="A"
              checked={gender === "A"}
              onChange={(e) => setGender(e.target.value)}
            />
            <span>Autre</span>
          </label>
        </div>


        <label>Date de naissance</label>
        <div className="birth-row">
          <select value={day} onChange={e => setDay(e.target.value)}>
            <option value="">Jour</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </select>

          <select value={month} onChange={e => setMonth(e.target.value)}>
            <option value="">Mois</option>
            {months.map(m => <option key={m}>{m}</option>)}
          </select>

          <select value={year} onChange={e => setYear(e.target.value)}>
            <option value="">Année</option>
            {[...Array(90)].map((_, i) => (
              <option key={2025 - i}>{2025 - i}</option>
            ))}
          </select>
        </div>

        <label>Nom utilisateur</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />

        <label>Spécialité</label>
        <select value={specialty} onChange={e => setSpecialty(e.target.value)}>
          <option value="">Choisir</option>
          <option>SAGI</option>
          <option>QIF</option>
          <option>BAT</option>
          <option>GBS</option>
          <option>PEIP</option>
        </select>

        <div className="toggle-container">
          <span className={!isVolunteer ? "active" : ""}>International</span>

          <label className="switch">
            <input
              type="checkbox"
              checked={isVolunteer}
              onChange={e => setIsVolunteer(e.target.checked)}
            />
            <span className="slider"></span>
          </label>

          <span className={isVolunteer ? "active" : ""}>Bénévole</span>
        </div>

        <button onClick={handleSubmit}>Suivant</button>
      </div>
    </div>
  );
}
