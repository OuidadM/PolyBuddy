import React from "react";
import "./Login.css";

import Orange from "../Home/assets/Orange.png";
import Mauve from "../Home/assets/Mauve.png";
import Vert from "../Home/assets/Vert.png";
import Saumon from "../Home/assets/Saumon.png";
import Rose from "../Home/assets/Rose.png";

import Logo from "../Home/assets/Logo.png";

export default function Login() {
  return (
    <div className="login-container">

      <div className="left-side">
        <img src={Orange} className="avatar avatar-orange" alt="" />
        <img src={Mauve} className="avatar avatar-mauve" alt="" />
        <img src={Vert} className="avatar avatar-vert" alt="" />
        <img src={Saumon} className="avatar avatar-saumon" alt="" />
        <img src={Rose} className="avatar avatar-violet" alt="" />
      </div>

      <div className="right-side">
        <img src={Logo} className="main-logo" alt="Logo" />

        <div className="form-box">

          <div className="input-group">
            <input
              type="text"
              className="input-field no-icon"
              placeholder="Nom d'utilisateur"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              className="input-field no-icon"
              placeholder="Mot de passe"
            />
          </div>

          <div className="remember-box">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Se rappeler de moi</label>
          </div>

          <button className="login-btn">Se connecter</button>

          <p className="forgot">Mot de passe oublié ?</p>

          <div className="separator">
            <span>OU</span>
          </div>

          <p className="noaccount">Vous n’avez pas de compte ?</p>

          <button className="signup-btn">S’inscrire</button>
        </div>
      </div>
    </div>
  );
}
