import React from 'react';
import './ProfileCard.css';

const ProfileCard = ({ 
  id,
  name, 
  role, 
  specialite,
  entreprise,
  mutuals, 
  image, 
  coverImage,
  isAlumni,
  sharedInterests 
}) => {
  return (
    <div className="profile-card">
      <button className="close-btn">×</button>
      
      <div 
        className="card-header" 
        style={{ 
          backgroundImage: coverImage 
            ? `url(${coverImage})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {/* Badge alumni */}
        {isAlumni && (
          <div className="alumni-badge-card">★</div>
        )}
      </div>

      <div className="avatar-container">
        <img src={image} alt={name} className="avatar" />
      </div>

      <div className="card-body">
        <h3 className="profile-name">{name}</h3>
        <p className="profile-role">{role}</p>
        
        {/* Informations supplémentaires */}
        {specialite && (
          <p className="profile-info">
            <img
              src="https://img.icons8.com/color-pixels/32/book.png"
              alt="book"
              style={{
                width: "20px",
                height: "20px",
                verticalAlign: "middle",
                marginRight: "8px"
              }}
            />
            {specialite}
          </p>
        )}

        
        {entreprise && (
          <p className="profile-info">🏢 {entreprise}</p>
        )}

        {/* Centres d'intérêt partagés */}
        {sharedInterests && sharedInterests.length > 0 && (
          <div className="shared-interests">
            <p className="shared-interests-label">
              💡 {sharedInterests.length} intérêt{sharedInterests.length > 1 ? 's' : ''} commun{sharedInterests.length > 1 ? 's' : ''}
            </p>
            <div className="interests-tags">
              {sharedInterests.slice(0, 3).map((interest, index) => (
                <span key={index} className="interest-tag">
                  {interest}
                </span>
              ))}
              {sharedInterests.length > 3 && (
                <span className="interest-tag">+{sharedInterests.length - 3}</span>
              )}
            </div>
          </div>
        )}
        
        {/* Amis en commun */}
        <div className="mutual-connections">
          <div className="mutual-avatars">
            <div className="circle-placeholder"></div>
          </div>
          <span>
            {mutuals === 0 
              ? "Aucun ami en commun" 
              : `${mutuals} ami${mutuals > 1 ? 's' : ''} en commun`
            }
          </span>
        </div>

        <button className="connect-btn">Se connecter</button>
      </div>
    </div>
  );
};

export default ProfileCard;