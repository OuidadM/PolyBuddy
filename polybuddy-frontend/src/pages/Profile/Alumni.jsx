import React, { useState } from "react";
import "./Alumni.css";

export default function AlumniProfile() {
  const [activeTab, setActiveTab] = useState("info");
  const [profileImage, setProfileImage] = useState(null);

  const interests = [
    // Sports
    "football",
    "judo",
    "basketball",
    "running",
    "natation",
    "fitness",
    "yoga",
    "randonnée",
    "danse",

    // Culture / Arts
    "cinéma",
    "musique",
    "photographie",
    "dessin",
    "lecture",
    "théâtre",

    // Jeux / Digital
    "jeux vidéo",
    "e-sport",
    "coding",
    "robotique",
    "IA",
    "crypto",

    // Vie quotidienne
    "cuisine",
    "voyage",
    "jardinage",
    "mode",
    "volontariat",

    // Étudiants internationaux
    "échanges culturels",
    "langues étrangères",
    "découverte de la France",
    "communauté internationale"
  ];

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="profile-wrapper">
      {/* PHOTO */}
      <div className="profile-photo">
        <div className="photo-wrapper alumni-badge-wrapper">
          <div className="alumni-badge">★</div>
          <div className="photo-circle">
            <img
              src={profileImage || "https://via.placeholder.com/180"}
              alt="Profil"
            />
          </div>
        </div>
        <label className="photo-edit">
          Modifier la photo
          <input type="file" hidden onChange={handleImageChange} />
        </label>
      </div>

      {/* TABS */}
      <div className="profile-tabs">
        <button className={activeTab === "info" ? "active" : ""} onClick={() => setActiveTab("info")}>
          Infos
        </button>
        <button className={activeTab === "contact" ? "active" : ""} onClick={() => setActiveTab("contact")}>
          Contact
        </button>
        <button className={activeTab === "interests" ? "active" : ""} onClick={() => setActiveTab("interests")}>
          Centres d'intérêt
        </button>
        <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
          Sécurité
        </button>
      </div>

      <div className="profile-content">
        {/* INFOS */}
        {activeTab === "info" && (
          <div className="card">
            <div className="card-content">
              <div className="section">
                <h3>Identité</h3>
                <div className="row">
                  <input placeholder="Prénom" />
                  <input placeholder="Nom" />
                </div>
                <div className="row">
                  <input placeholder="Nom d'utilisateur" />
                  <input
                    placeholder="Numéro étudiant"
                    disabled
                    className="locked-field"
                  />
                </div>
                <div className="row">
                  <input type="date" />
                  <input placeholder="Nationalité" />
                  <input placeholder="Langue parlée" />
                </div>
              </div>

              <div className="section">
                <h3>Adresse</h3>
                <div className="row">
                  <input placeholder="Adresse" />
                  <input placeholder="Complément d'adresse" />
                  <input placeholder="Code postal" />
                </div>
              </div>

              {/* FORMATION */}
              <div className="section">
                <h3>Formation</h3>
                <div className="row">
                  <input placeholder="Spécialité" />
                </div>
              </div>

              <div className="section">
                <h3>Parcours professionnel</h3>
                <div className="row">
                  <input placeholder="Année de diplomation" />
                  <input placeholder="Poste actuel" />
                  <input placeholder="Entreprise" />
                </div>
              </div>

              <button className="save-btn">Enregistrer</button>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {activeTab === "contact" && (
          <div className="card">
            <div className="card-content">
              <h3>Contact</h3>
              <div className="column">
                <input
                  placeholder="Email universitaire"
                  disabled
                  className="locked-field"
                />
                <input placeholder="+33 Numéro de téléphone" />
              </div>
              <button className="save-btn">Enregistrer</button>
            </div>
          </div>
        )}

        {/* INTERESTS */}
        {activeTab === "interests" && (
          <div className="card">
            <div className="card-content">
              <h3>Centres d'intérêt</h3>
              <div className="interests-container">
                <h4 className="interests-category">Sports</h4>
                <div className="interests-grid">
                  {interests.slice(0, 9).map((i) => (
                    <label key={i} className="interest-item">
                      <input type="checkbox" /> {i}
                    </label>
                  ))}
                </div>

                <h4 className="interests-category">Culture / Arts</h4>
                <div className="interests-grid">
                  {interests.slice(9, 15).map((i) => (
                    <label key={i} className="interest-item">
                      <input type="checkbox" /> {i}
                    </label>
                  ))}
                </div>

                <h4 className="interests-category">Jeux / Digital</h4>
                <div className="interests-grid">
                  {interests.slice(15, 21).map((i) => (
                    <label key={i} className="interest-item">
                      <input type="checkbox" /> {i}
                    </label>
                  ))}
                </div>

                <h4 className="interests-category">Vie quotidienne</h4>
                <div className="interests-grid">
                  {interests.slice(21, 26).map((i) => (
                    <label key={i} className="interest-item">
                      <input type="checkbox" /> {i}
                    </label>
                  ))}
                </div>

                <h4 className="interests-category">Étudiants internationaux</h4>
                <div className="interests-grid">
                  {interests.slice(26, 30).map((i) => (
                    <label key={i} className="interest-item">
                      <input type="checkbox" /> {i}
                    </label>
                  ))}
                </div>
              </div>
              <button className="save-btn">Enregistrer</button>
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <div className="card">
            <div className="card-content">
              <h3>Sécurité</h3>
              <div className="column">
                <input type="password" placeholder="Mot de passe actuel" />
                <input type="password" placeholder="Nouveau mot de passe" />
                <input type="password" placeholder="Confirmer le mot de passe" />
              </div>
              <button className="save-btn">Modifier le mot de passe</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}