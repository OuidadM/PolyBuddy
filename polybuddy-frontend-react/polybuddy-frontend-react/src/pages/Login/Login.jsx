import React from "react";
import "./Login.css";

import Orange from "../Home/assets/Orange.png";
import Mauve from "../Home/assets/Mauve.png";
import Vert from "../Home/assets/Vert.png";
import Saumon from "../Home/assets/Saumon.png";
import Rose from "../Home/assets/Rose.png";

import Logo from "../Home/assets/Logo.png";
import Profile from "../Home/assets/Profile (1).png";
import Secure from "../Home/assets/Secure (1).png";

export default function Login() {
  return (
    <div className="login-container">

      <div className="left-side">
        <img src={Orange} className="avatar avatar-orange" />
        <img src={Mauve} className="avatar avatar-mauve" />
        <img src={Vert} className="avatar avatar-vert" />
        <img src={Saumon} className="avatar avatar-saumon" />
        <img src={Rose} className="avatar avatar-violet" />
      </div>

      <div className="right-side">
        <img src={Logo} className="main-logo" />

        <div className="form-box">
          <div className="input-group">
            <img src={Profile} alt="Profile" className="input-icon" />
            <input type="text" placeholder="Nom d'utilisateur" className="input-field" />
          </div>
          <div className="input-group">
            <img src={Secure} alt="Secure" className="input-icon" />
            <input type="password" placeholder="Mot de passe" className="input-field" />
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
