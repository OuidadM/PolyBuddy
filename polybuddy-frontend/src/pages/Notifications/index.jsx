// src/pages/Notifications/index.jsx
import React, { useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import invitationService from '../../services/invitation.service';
import { Paper, Avatar, Button, Box, Typography } from '@mui/material';
import './Notifications.css';

const Notifications = () => {
  const { getAvatarUrl } = useOutletContext();
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const response = await invitationService.getReceivedInvitations();
      setInvitations(response.data || []);
    } catch (err) {
      console.error("Erreur chargement invitations:", err);
      setError("Impossible de charger les invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      await invitationService.acceptInvitation(invitationId);
      // Retirer l'invitation de la liste
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error("Erreur acceptation invitation:", error);
      alert("Erreur lors de l'acceptation de l'invitation");
    }
  };

  const handleDelete = async (invitationId) => {
    try {
      await invitationService.deleteInvitation(invitationId);
      // Retirer l'invitation de la liste
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error("Erreur suppression invitation:", error);
      alert("Erreur lors de la suppression de l'invitation");
    }
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <Typography variant="h5" sx={{ mb: 3 }}>Notifications</Typography>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Chargement des invitations...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <Typography variant="h5" sx={{ mb: 3 }}>Notifications</Typography>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Notifications
      </Typography>

      {invitations.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Aucune invitation en attente
          </Typography>
        </Paper>
      ) : (
        <div className="invitations-list">
          {invitations.map((invitation) => (
            <Paper 
              key={invitation.id} 
              elevation={2} 
              className="invitation-card"
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={invitation.expediteur.avatar_url || getAvatarUrl('default')}
                  alt={invitation.expediteur.name}
                  sx={{ width: 60, height: 60 }}
                />
                
                <Box flex={1}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {invitation.expediteur.name}
                    {invitation.expediteur.isAlumni && (
                      <span style={{ marginLeft: '8px', fontSize: '18px' }}>★</span>
                    )}
                  </Typography>
                  
                  {invitation.expediteur.specialite && (
                    <Typography variant="body2" color="text.secondary">
                      {invitation.expediteur.specialite}
                    </Typography>
                  )}
                  
                  {invitation.expediteur.entreprise && (
                    <Typography variant="body2" color="text.secondary">
                      🏢 {invitation.expediteur.entreprise}
                    </Typography>
                  )}
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {new Date(invitation.date_envoi).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>
                </Box>

                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAccept(invitation.id)}
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: '20px',
                      px: 3
                    }}
                  >
                    Accepter
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(invitation.id)}
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: '20px',
                      px: 3
                    }}
                  >
                    Supprimer
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;