import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import ProfileCard from './components/ProfileCard';
import feedService from '../../services/feed.service';
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import './Feed.css';

const Feed = () => {
  const { getAvatarUrl } = useOutletContext();
  const [recommendations, setRecommendations] = useState({
    sameSpecialty: [],
    alumniSpecialty: [],
    sharedInterests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await feedService.getRecommendations();
      setRecommendations(data.data);
    } catch (err) {
      console.error("Erreur chargement recommandations:", err);
      setError("Impossible de charger les recommandations");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="feed-main">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Chargement des recommandations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-main">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="feed-main">
      <Paper elevation={1} className="search-bar">
        <SearchIcon sx={{ fontSize: 43, color: "text.secondary", marginRight: 2 }} />
      </Paper>

      <div className="feed-scroll-area">
        {/* 1️⃣ Étudiants de la même spécialité */}
        {recommendations.sameSpecialty.length > 0 && (
          <div className="recommendation-section">
            <h2 className="section-title"><img
                src="https://img.icons8.com/color/48/graduation-cap.png"
                alt="graduation-cap"
                style={{
                  width: "28px",
                  height: "28px",
                  verticalAlign: "middle",
                  marginRight: "8px"
                }}
              /> Étudiants de votre spécialité</h2>
            <div className="profiles-grid">
              {recommendations.sameSpecialty.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  id={profile.id}
                  name={profile.name}
                  role={profile.role}
                  specialite={profile.specialite}
                  mutuals={profile.mutualFriends}
                  image={profile.avatar_url || "https://via.placeholder.com/180"}
                  isAlumni={false}
                  getAvatarUrl={getAvatarUrl}
                />
              ))}
            </div>
          </div>
        )}

        {/* 2️⃣ Alumni de la même spécialité */}
        {recommendations.alumniSpecialty.length > 0 && (
          <div className="recommendation-section">
            <h2 className="section-title">
              <img
                src="https://img.icons8.com/flat-round/64/star--v1.png"
                alt="star--v1'"
                style={{
                  width: "28px",
                  height: "28px",
                  color: "#f5276bff",
                  verticalAlign: "middle",
                  marginRight: "8px"
                }}
              />
              Alumni de votre spécialité
            </h2>

            <div className="profiles-grid">
              {recommendations.alumniSpecialty.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  id={profile.id}
                  name={profile.name}
                  role={profile.role}
                  specialite={profile.specialite}
                  entreprise={profile.entreprise}
                  annee_diplome={profile.annee_diplome}
                  mutuals={profile.mutualFriends}
                  image={profile.avatar_url || "https://via.placeholder.com/180"}
                  isAlumni={true}
                  getAvatarUrl={getAvatarUrl}
                />
              ))}
            </div>
          </div>
        )}

        {/* 3️⃣ Utilisateurs avec centres d'intérêt communs */}
        {recommendations.sharedInterests.length > 0 && (
          <div className="recommendation-section">
            <h2 className="section-title">
              <img 
              src="https://img.icons8.com/nolan/64/drawing.png" 
              alt="drawing" style={{
                  width: "28px",
                  height: "28px",
                  verticalAlign: "middle",
                  marginRight: "8px"
                }}/> Centres d'intérêt communs</h2>
            <div className="profiles-grid">
              {recommendations.sharedInterests.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  id={profile.id}
                  name={profile.name}
                  role={profile.role}
                  specialite={profile.specialite}
                  mutuals={profile.mutualFriends}
                  sharedInterests={profile.sharedInterests}
                  image={profile.avatar_url || "https://via.placeholder.com/180"}
                  isAlumni={profile.isAlumni}
                  getAvatarUrl={getAvatarUrl}
                />
              ))}
            </div>
          </div>
        )}

        {/* Message si aucune recommandation */}
        {recommendations.sameSpecialty.length === 0 &&
         recommendations.alumniSpecialty.length === 0 &&
         recommendations.sharedInterests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <p>Aucune recommandation disponible pour le moment.</p>
            <p>Complétez votre profil pour obtenir de meilleures recommandations !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;