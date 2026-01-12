import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import invitationService from '../../../../services/invitation.service';
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
  const [invitationStatus, setInvitationStatus] = useState('none');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkStatus();
  }, [id]);

  const checkStatus = async () => {
    try {
      const response = await invitationService.checkInvitationStatus(id);
      setInvitationStatus(response.data.status);
    } catch (error) {
      console.error("Erreur vérification statut:", error);
    }
  };

  const handleConnect = async () => {
    if (invitationStatus === 'pending_sent') {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (invitationStatus === 'friends') {
      // Naviguer vers le chat avec cet ami
      navigate('/chat', { state: { friendId: id } });
      return;
    }

    setLoading(true);
    try {
      await invitationService.sendInvitation(id);
      setInvitationStatus('pending_sent');
    } catch (error) {
      console.error("Erreur envoi invitation:", error);
      if (error.message?.includes("déjà envoyé") || error.message?.includes("en attente")) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    switch (invitationStatus) {
      case 'friends':
        return 'Message';
      case 'pending_sent':
        return (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img 
              width="18" 
              height="18" 
              src="https://img.icons8.com/ios/50/important-time.png" 
              alt="pending"
              style={{ 
                marginRight: '6px',
                filter: 'invert(47%) sepia(85%) saturate(1890%) hue-rotate(195deg) brightness(95%) contrast(101%)'
              }}
            />
            En attente
          </span>
        );
      case 'pending_received':
        return 'Accepter';
      default:
        return 'Se connecter';
    }
  };

  return (
    <div className="profile-card">
      <button className="close-btn">×</button>
      
      {/* Alerte */}
      {showAlert && (
        <div className="invitation-alert">
          <p>⚠️ Vous avez déjà envoyé votre invitation.</p>
          <p>Votre demande est en attente.</p>
        </div>
      )}

      <div 
        className="card-header" 
        style={{ 
          backgroundImage: coverImage 
            ? `url(${coverImage})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
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

        <button 
          className={`connect-btn ${invitationStatus === 'pending_sent' ? 'pending' : ''} ${invitationStatus === 'friends' ? 'connected' : ''}`}
          onClick={handleConnect}
          disabled={loading}
        >
          {loading ? 'Envoi...' : getButtonContent()}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;