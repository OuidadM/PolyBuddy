import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-container">

      {/* LEFT SIDE – AVATARS */}
      <div className="left-side">

        <img src="/avatars/Orange.png" alt="" className="avatar avatar-orange" />
        <img src="/avatars/Mauve.png" alt="" className="avatar avatar-mauve" />
        <img src="/avatars/Vert.png" alt="" className="avatar avatar-vert" />
        <img src="/avatars/Saumon.png" alt="" className="avatar avatar-saumon" />
        <img src="/avatars/Rose.png" alt="" className="avatar avatar-violet" />

      </div>

      {/* RIGHT SIDE */}
      <div className="right-side">

        <img src="/Images/logo.png" alt="logo" className="main-logo" />

        <div className="form-box">
          <input type="text" placeholder="Nom d'utilisateur" className="input-field" />
          <input type="password" placeholder="Mot de passe" className="input-field" />

          <div className="remember-box">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Se rappeler de moi</label>
          </div>

          <button className="login-btn">Se connecter</button>

          <p className="forgot">Mot de passe oublié ?</p>

          {/* SEPARATOR */}
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
