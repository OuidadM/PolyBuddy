import React, { useState } from "react";
import "./Login.css";

import Orange from "../Home/assets/Orange.png";
import Mauve from "../Home/assets/Mauve.png";
import Vert from "../Home/assets/Vert.png";
import Saumon from "../Home/assets/Saumon.png";
import Rose from "../Home/assets/Rose.png";

import Logo from "../Home/assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; // ✅ Import du Context

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Récupérer la fonction login du Context
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Réinitialiser le message d'erreur
    setErrorMessage("");

    // Validation des champs
    if (!username.trim()) {
      alert("Veuillez entrer votre nom d'utilisateur");
      return;
    }

    if (!password.trim()) {
      alert("Veuillez entrer votre mot de passe");
      return;
    }

    // Préparation des données
    const loginData = {
      username: username.trim(),
      password: password
    };

    try {
      setIsLoading(true);
      
      // ✅ Appel à la fonction login du Context
      // Le Context gère automatiquement la redirection selon le rôle
      await login(loginData);
      
    } catch (error) {
      // Afficher le message d'erreur
      setErrorMessage(error.error);
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la touche Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

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
          {/* Message d'erreur */}
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <div className="input-group">
            <input
              type="text"
              className="input-field no-icon"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              className="input-field no-icon"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
          </div>

          <div className="remember-box">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Se rappeler de moi</label>
          </div>

          <button 
            className="login-btn" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="forgot">Mot de passe oublié ?</p>

          <div className="separator">
            <span>OU</span>
          </div>

          <p className="noaccount">Vous n'avez pas de compte ?</p>

          <button 
            className="signup-btn" 
            onClick={() => navigate('/register/1')}
            disabled={isLoading}
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}