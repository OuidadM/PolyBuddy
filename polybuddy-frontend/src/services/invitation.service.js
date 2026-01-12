// src/services/invitation.service.js
import axios from 'axios';

const API_URL ='http://localhost:5000/api';

// Configuration Axios pour envoyer les cookies automatiquement
const axiosConfig = {
  withCredentials: true, // ✅ Envoie les cookies avec chaque requête
  headers: {
    'Content-Type': 'application/json'
  }
};

const invitationService = {
  // Envoyer une invitation
  async sendInvitation(destinataireId) {
    try {
      const response = await axios.post(
        `${API_URL}/invitations`,
        { destinataireId },
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les invitations reçues
  async getReceivedInvitations() {
    try {
      const response = await axios.get(
        `${API_URL}/invitations/received`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les invitations envoyées
  async getSentInvitations() {
    try {
      const response = await axios.get(
        `${API_URL}/invitations/sent`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Vérifier le statut avec un utilisateur
  async checkInvitationStatus(targetUserId) {
    try {
      const response = await axios.get(
        `${API_URL}/invitations/status/${targetUserId}`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Accepter une invitation
  async acceptInvitation(invitationId) {
    try {
      const response = await axios.put(
        `${API_URL}/invitations/${invitationId}/accept`,
        {},
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Supprimer/Refuser une invitation
  async deleteInvitation(invitationId) {
    try {
      const response = await axios.delete(
        `${API_URL}/invitations/${invitationId}`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default invitationService;