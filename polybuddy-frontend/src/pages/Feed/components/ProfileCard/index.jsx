import React from 'react';
import './ProfileCard.css';
const ProfileCard = ({ name, role, mutuals, image, coverImage }) => {
  return (
    <div className="profile-card">
      <button className="close-btn">×</button>
      
      <div 
        className="card-header" 
        style={{ backgroundImage: `url(${coverImage})` }}
      ></div>

      <div className="avatar-container">
        <img src={image} alt={name} className="avatar" />
      </div>

      <div className="card-body">
        <h3 className="profile-name">{name}</h3>
        <p className="profile-role">{role}</p>
        
        <div className="mutual-connections">
          <div className="mutual-avatars">
             <div className="circle-placeholder"></div>
          </div>
          <span>{mutuals}</span>
        </div>

        <button className="connect-btn">Connect</button>
      </div>
    </div>
  );
};

export default ProfileCard;