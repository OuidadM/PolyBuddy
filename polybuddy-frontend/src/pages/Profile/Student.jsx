import React, { useState, useEffect  } from "react";
import "./Student.css";
import profileService from "../../services/profile.service";

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("info");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    // ======================
    // USER
    // ======================
    prenom: "",
    nom: "",
    username: "",
    numero: "",
    email:"",
    nationalite: "",
    langue: "",
    date_naissance: "",
    avatar_url: "",

    // ======================
    // ADDRESS
    // ======================
    address: {
      street: "",
      complement: "",
      postalCode: "",
      city: ""
    },

    // ======================
    // STUDENT
    // ======================
    student: {
      num_student: "",
      niveau: "",
      specialite: "",
      mail_univ: "",
      centres_interet: []
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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getMyProfile();
        console.log(data);
        setProfile({
          // ======================
          // USER
          // ======================
          prenom: data.prenom || "",
          nom: data.nom || "",
          username: data.login || "",
          numero: data.numero || "",
          email: data.email || "",
          nationalite: data.nationalite || "",
          langue: data.langue || "",
          date_naissance: formatDateForInput(data.dateNaissance),
          avatar_url: data.avatar_url || "",

          // ======================
          // ADDRESS
          // ======================
          address: {
            street: data.address?.street || "",
            complement: data.address?.complement || "",
            postalCode: data.address?.postalCode || "",
            city: data.address?.city || ""
          },

          // ======================
          // STUDENT
          // ======================
          student: {
            num_student: data.student?.num_etudiant || "",
            niveau: data.student?.niveau || "",
            specialite: data.student?.specialite || "",
            mail_univ: data.student?.mail_univ || "",
            centres_interet: data.student?.centres_interet || []
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

  const handleSave = async () => {
    try {
      const payload = structuredClone(profile);

      if (!payload.student.mail_univ) {
        delete payload.student.mail_univ;
      }
      await profileService.updateMyProfile(payload);
      alert("Profil mis à jour");
    } catch (error) {
      console.error("❌ Erreur sauvegarde", error);
      alert("Erreur lors de la sauvegarde");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Chargement...</p>;

  return (
    <div className="profile-wrapper">
      {/* PHOTO */}
      <div className="profile-photo">
        <div className="photo-wrapper">
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
        {["info", "contact", "interests", "security"].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "info" && "Infos"}
            {tab === "contact" && "Contact"}
            {tab === "interests" && "Centres d'intérêt"}
            {tab === "security" && "Sécurité"}
          </button>
        ))}
      </div>

      <div className="profile-content">
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
              <h3>Adresse</h3>
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

              <div className="section">
              <h3>Formation</h3>
              <div className="row">
                <input
                  value={profile.student.niveau}
                  onChange={e =>
                    setProfile({
                      ...profile,
                      student: {
                        ...profile.student,
                        niveau: e.target.value
                      }
                    })
                  }
                  placeholder="Niveau"
                />

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

              <button className="save-btn" onClick={handleSave}>Enregistrer</button>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="card">
            <div className="card-content">
              <h3>Contact</h3>
              <div className="column">
                <input
                  placeholder="Email universitaire"
                  value={profile.student.mail_univ}
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