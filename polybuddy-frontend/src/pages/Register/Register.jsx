import React from "react";
import "./Register.css";

// IMPORT IMAGES (paths adaptés à ton projet)
import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";

import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";
import Saumon from "../Home/assets/Saumon.png";

import Attach from "../Home/assets/Attach.png";

export default function Register() {
  return (
    <div className="acces-container">

      {/* BACKGROUND IMAGES */}
      <img src={Graduate} className="bg-img graduate" alt="" />
      <img src={Vector} className="bg-img vector" alt="" />

      {/* TITLE */}
      <h1 className="top-title">Rejoins-nous</h1>

      {/* AVATARS */}
      <img src={Orange} className="avatar avatar-1" alt="" />
      <img src={Vert} className="avatar avatar-2" alt="" />
      <img src={Rose} className="avatar avatar-3" alt="" />
      <img src={Mauve} className="avatar avatar-4" alt="" />
      <img src={Saumon} className="avatar avatar-5" alt="" />
      <img src={Saumon} className="avatar avatar-6" alt="" />

      {/* BOX */}
      <div className="acces-box">

        <input
          type="email"
          className="input-field"
          placeholder="Email universitaire"
        />

        <input
          type="password"
          className="input-field"
          placeholder="Mot de passe"
        />

        <input
          type="password"
          className="input-field"
          placeholder="Confirmez le mot de passe"
        />

        <div className="separator-line">
          <div className="line"></div>
          <span>OU</span>
          <div className="line"></div>
        </div>

        <label className="file-upload">
          <img src={Attach} className="attach-icon" alt="attach" />
          <span>Importer votre lettre d’admission</span>
          <input type="file" hidden />
        </label>

        <p className="formats">
          Formats acceptés : PDF, PNG, JPG — Taille max : 5 Mo
        </p>

        <button className="next-btn">Suivant</button>
      </div>
    </div>
  );
}
