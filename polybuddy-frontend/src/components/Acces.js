import React from "react";
import "./Acces.css";

export default function Acces() {
  return (
    <div className="acces-container">

      {/* BACKGROUND IMAGES */}
      <img src="/icons/background/Graduate.png" className="bg-img graduate" alt="" />
      <img src="/icons/background/Vector.png" className="bg-img vector" alt="" />

      {/* TITRE */}
      <h1 className="top-title">Rejoins-nous</h1>

      {/* AVATARS */}
      <img src="/avatars/Orange.png" className="avatar avatar-1" alt="" />
      <img src="/avatars/Vert.png" className="avatar avatar-2" alt="" />
      <img src="/avatars/Rose.png" className="avatar avatar-3" alt="" />
      <img src="/avatars/Mauve.png" className="avatar avatar-4" alt="" />
      <img src="/avatars/Saumon.png" className="avatar avatar-5" alt="" />
      <img src="/avatars/Saumon.png" className="avatar avatar-6" alt="" />

      {/* BOX CENTRALE */}
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
          <img src="/icons/attach.png" className="attach-icon" alt="attach" />
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
