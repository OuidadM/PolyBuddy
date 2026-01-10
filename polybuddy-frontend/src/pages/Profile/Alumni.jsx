import React, { useState, useEffect } from "react";
import "./Alumni.css";

import profileService from "../../services/profile.service";

export default function AlumniProfile() {
  const [activeTab, setActiveTab] = useState("info");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    // USER
    prenom: "",
    nom: "",
    username: "",
    email: "",
    numero: "",
    nationalite: "",
    langue: "",
    date_naissance: "",
    avatar_url: "",

    // ADDRESS
    address: {
      street: "",
      complement: "",
      postalCode: "",
      city: ""
    },

    // STUDENT (toujours présent)
    student: {
      num_student: "",
      niveau: "",
      specialite: "",
      mail_univ: "",
      centres_interet: [],

      // ALUMNI (extension)
      alumni: {
        annee_diplome: "",
        position: "",
        entreprise: ""
      }
    }
  });


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

  const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
  
      setProfileImage(URL.createObjectURL(file));
  
      try {
        const res = await profileService.uploadAvatar(file);
        setProfile({ ...profile, avatar_url: res.avatarUrl });
      } catch (error) {
        console.error("❌ Erreur upload avatar", error);
      }
    };

  useEffect(() => {
      const loadProfile = async () => {
        try {
          const data = await profileService.getMyProfile();
          console.log(data);
          setProfile({
            prenom: data.prenom || "",
            nom: data.nom || "",
            username: data.login || "",
            email: data.email || "",
            numero: data.numero || "",
            nationalite: data.nationalite || "",
            langue: data.langue || "",
            date_naissance: formatDateForInput(data.dateNaissance),
            avatar_url: data.avatar_url || "",

            address: {
              street: data.address?.street || "",
              complement: data.address?.complement || "",
              postalCode: data.address?.postalCode || "",
              city: data.address?.city || ""
            },

            student: {
              num_student: data.student?.num_etudiant || "",
              niveau: data.student?.niveau || "",
              specialite: data.student?.specialite || "",
              mail_univ: data.student?.mail_univ || "",
              centres_interet: data.student?.centres_interet || [],

              alumni: {
                annee_diplome: data.student?.alumni?.annee_diplome || "",
                position: data.student?.alumni?.position || "",
                entreprise: data.student?.alumni?.entreprise || ""
              }
            }
          });

  
          setProfileImage(data.avatar_url);
        } catch (error) {
          console.error("❌ Erreur chargement profil", error);
        } finally {
          setLoading(false);
        }
      };
  
      loadProfile();
    }, []);

    const formatDateForInput = (isoDate) => {
      if (!isoDate) return '';
      
      // Extraire seulement la partie yyyy-MM-dd
      return isoDate.split('T')[0];
    };


    const handleSave = async () => {
      const payload = structuredClone(profile);

      // éviter validations inutiles
      if (!payload.student.mail_univ) {
        delete payload.student.mail_univ;
      }

      await profileService.updateMyProfile(payload);
      alert("Profil mis à jour");
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
                  <input value={profile.prenom} onChange={e => setProfile({ ...profile, prenom: e.target.value })} placeholder="Prénom" />
                  <input value={profile.nom} onChange={e => setProfile({ ...profile, nom: e.target.value })} placeholder="Nom" />
                </div>
                <div className="row">
                  <input value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })} placeholder="Nom d'utilisateur" />
                  <input value={profile.student.num_student} disabled className="locked-field" />
                </div>
                <div className="row">
                  <input type="date" value={profile.date_naissance} onChange={e => setProfile({ ...profile, date_naissance: e.target.value })} />
                  <input value={profile.nationalite} onChange={e => setProfile({ ...profile, nationalite: e.target.value })} placeholder="Nationalité" />
                  <input value={profile.langue} onChange={e => setProfile({ ...profile, langue: e.target.value })} placeholder="Langue parlée" />
                </div>
              </div>

              <div className="section">
                <div className="row">
                  <input
                    value={profile.address.city}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        address: {
                          ...profile.address,
                          city: e.target.value
                        }
                      })
                    }
                    placeholder="Ville"
                  />

                  <input
                    value={profile.address.postalCode}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        address: {
                          ...profile.address,
                          postalCode: e.target.value
                        }
                      })
                    }
                    placeholder="Code postal"
                  />

                  <input
                    value={profile.address.complement}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        address: {
                          ...profile.address,
                          complement: e.target.value
                        }
                      })
                    }
                    placeholder="Complément d'adresse"
                  />
                </div>
              </div>

              {/* FORMATION */}
              <div className="section">
                <h3>Formation</h3>
                <div className="row">
                  <input
                  value={profile.student.specialite}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      student: {
                        ...profile.student,
                        specialite: e.target.value
                      }
                    })
                  }
                  placeholder="Spécialité"
                />
                </div>
              </div>

              <div className="section">
                <h3>Parcours professionnel</h3>
                <div className="row">
                  <input placeholder="Année de diplomation" value={profile.student.alumni.annee_diplome}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        student: {
                          ...profile.student,
                          alumni: {
                            ...profile.student.alumni,
                            annee_diplome: e.target.value
                          }
                        }
                      })
                    } />
                  <input placeholder="Poste actuel" value={profile.student.alumni.position}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        student: {
                          ...profile.student,
                          alumni: {
                            ...profile.student.alumni,
                            position: e.target.value
                          }
                        }
                      })
                    }/>
                  <input placeholder="Entreprise" value={profile.student.alumni.entreprise}
                    onChange={e =>
                      setProfile({
                        ...profile,
                        student: {
                          ...profile.student,
                          alumni: {
                            ...profile.student.alumni,
                            entreprise: e.target.value
                          }
                        }
                      })
                    } />
                </div>
              </div>

              <button className="save-btn" onClick={handleSave}>Enregistrer</button>
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
                <input
                  placeholder="Email personnel"
                  value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
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