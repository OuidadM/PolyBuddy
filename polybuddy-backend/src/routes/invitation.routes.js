// src/routes/invitation.routes.js
const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitation.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Envoyer une invitation
router.post('/', invitationController.sendInvitation);

// Récupérer les invitations reçues
router.get('/received', invitationController.getReceivedInvitations);

// Récupérer les invitations envoyées
router.get('/sent', invitationController.getSentInvitations);

// Vérifier le statut avec un utilisateur
router.get('/status/:targetUserId', invitationController.checkInvitationStatus);

// Accepter une invitation
router.put('/:invitationId/accept', invitationController.acceptInvitation);

// Supprimer/Refuser une invitation
router.delete('/:invitationId', invitationController.deleteInvitation);

module.exports = router;