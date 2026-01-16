// src/routes/conversation.routes.js
const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

// =========================
// 👥 AMIS & GROUPES
// =========================

// Récupérer tous les amis
router.get('/friends', conversationController.getFriends);

// Récupérer les groupes
router.get('/groups', conversationController.getGroups);

// ➕ Créer un groupe (alumni uniquement)
router.post('/groups', conversationController.createGroup);

// 🔍 Rechercher des étudiants
router.get('/students/search', conversationController.searchStudents);

// =========================
// 💬 CONVERSATIONS
// =========================

// Compter les messages non lus
router.get('/unread-count', conversationController.getUnreadCount);

// Créer ou récupérer une conversation avec un ami
router.post('/create', conversationController.getOrCreateConversation);

// Récupérer toutes les conversations de l'utilisateur
router.get('/', conversationController.getUserConversations);

// =========================
// 📩 MESSAGES
// =========================

// Récupérer les messages d'une conversation
router.get('/:conversationId/messages', conversationController.getMessages);

// Envoyer un message dans une conversation
router.post('/:conversationId/messages', conversationController.sendMessage);

// Marquer les messages comme lus
router.put('/:conversationId/read', conversationController.markAsRead);

module.exports = router;
