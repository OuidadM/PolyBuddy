// src/routes/conversation.routes.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// Récupérer tous les amis
router.get('/friends', conversationController.getFriends);

router.get('/groups', conversationController.getGroups);

// Créer ou récupérer une conversation avec un ami
router.post('/create', conversationController.getOrCreateConversation);

// Récupérer toutes les conversations de l'utilisateur
router.get('/', conversationController.getUserConversations);

// Récupérer les messages d'une conversation
router.get('/:conversationId/messages', conversationController.getMessages);

// Envoyer un message dans une conversation
router.post('/:conversationId/messages', conversationController.sendMessage);

// Marquer les messages comme lus
router.put('/:conversationId/read', conversationController.markAsRead);

module.exports = router;