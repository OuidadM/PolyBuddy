// src/controllers/invitation.controller.js
const invitationService = require('../services/invitation.service');

const invitationController = {
  // Envoyer une invitation
  async sendInvitation(req, res) {
    try {
      const expediteurId = req.user.id; // ID de l'utilisateur connecté
      const { destinataireId } = req.body;

      if (!destinataireId) {
        return res.status(400).json({ 
          success: false, 
          message: "L'ID du destinataire est requis" 
        });
      }

      if (expediteurId === destinataireId) {
        return res.status(400).json({ 
          success: false, 
          message: "Vous ne pouvez pas vous envoyer une invitation à vous-même" 
        });
      }

      const result = await invitationService.sendInvitation(expediteurId, destinataireId);
      
      return res.status(201).json({
        success: true,
        message: "Invitation envoyée avec succès",
        data: result
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'invitation:", error);
      
      if (error.message.includes("déjà envoyé") || error.message.includes("déjà amis")) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de l'invitation"
      });
    }
  },

  // Récupérer les invitations reçues
  async getReceivedInvitations(req, res) {
    try {
      const userId = req.user.id;
      const invitations = await invitationService.getReceivedInvitations(userId);
      
      return res.status(200).json({
        success: true,
        data: invitations
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des invitations:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des invitations"
      });
    }
  },

  // Récupérer les invitations envoyées
  async getSentInvitations(req, res) {
    try {
      const userId = req.user.id;
      const invitations = await invitationService.getSentInvitations(userId);
      
      return res.status(200).json({
        success: true,
        data: invitations
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des invitations envoyées:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des invitations envoyées"
      });
    }
  },

  // Accepter une invitation
  async acceptInvitation(req, res) {
    try {
      const userId = req.user.id;
      const { invitationId } = req.params;

      const result = await invitationService.acceptInvitation(invitationId, userId);
      
      return res.status(200).json({
        success: true,
        message: "Invitation acceptée avec succès",
        data: result
      });
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'invitation:", error);
      
      if (error.message.includes("non trouvée") || error.message.includes("n'êtes pas")) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'acceptation de l'invitation"
      });
    }
  },

  // Refuser/Supprimer une invitation
  async deleteInvitation(req, res) {
    try {
      const userId = req.user.id;
      const { invitationId } = req.params;

      await invitationService.deleteInvitation(invitationId, userId);
      
      return res.status(200).json({
        success: true,
        message: "Invitation supprimée avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'invitation:", error);
      
      if (error.message.includes("non trouvée") || error.message.includes("n'êtes pas")) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de l'invitation"
      });
    }
  },

  // Vérifier le statut d'une invitation entre deux utilisateurs
  async checkInvitationStatus(req, res) {
    try {
      const userId = req.user.id;
      const { targetUserId } = req.params;

      const status = await invitationService.checkInvitationStatus(userId, targetUserId);
      
      return res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification du statut"
      });
    }
  }
};

module.exports = invitationController;