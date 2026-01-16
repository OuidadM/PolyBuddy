import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RegisterSuccess.css";

// IMAGES (mêmes que register)
import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";
import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";

export default function RegisterSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const message =
    state?.message ||
    "Votre inscription a été enregistrée avec succès.";

  return (
    <div className="register-success-page">
      {/* Background */}
      <img src={Graduate} className="bg-img create-graduate" alt="" />
      <img src={Vector} className="bg-img create-vector" alt="" />

      {/* Avatars */}
      <img src={Orange} className="create-avatar create-avatar-top-left" alt="" />
      <img src={Vert} className="create-avatar create-avatar-top-right" alt="" />
      <img src={Rose} className="create-avatar create-avatar-bottom-left" alt="" />
      <img src={Mauve} className="create-avatar create-avatar-bottom-right" alt="" />

      {/* Popup */}
      <div className="success-box">
        <h2>🎉 Inscription réussie</h2>

        <p>{message}</p>

        <button
          className="success-btn"
          onClick={() => navigate("/login")}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
