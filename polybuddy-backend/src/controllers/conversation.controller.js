// src/controllers/conversation.controller.js
const conversationService = require('../services/conversation.service');

const conversationController = {
  // Récupérer tous les amis
  async getFriends(req, res) {
    try {
      const userId = req.user.id;
      const friends = await conversationService.getFriends(userId);
      
      return res.status(200).json({
        success: true,
        data: friends
      });
    } catch (error) {
      console.error("Erreur récupération amis:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des amis"
      });
    }
  },

  // Créer ou récupérer une conversation
  async getOrCreateConversation(req, res) {
    try {
      const userId = req.user.id;
      const { friendId } = req.body;

      if (!friendId) {
        return res.status(400).json({
          success: false,
          message: "L'ID de l'ami est requis"
        });
      }

      const conversation = await conversationService.getOrCreateDirectConversation(
        userId,
        friendId
      );
      
      return res.status(200).json({
        success: true,
        data: { conversationId: conversation.id_conv }
      });
    } catch (error) {
      console.error("Erreur création conversation:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création de la conversation"
      });
    }
  },

  // Récupérer toutes les conversations
  async getUserConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await conversationService.getUserConversations(userId);
      
      return res.status(200).json({
        success: true,
        data: conversations
      });
    } catch (error) {
      console.error("Erreur récupération conversations:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des conversations"
      });
    }
  },

  // Récupérer les messages d'une conversation
  async getMessages(req, res) {
    try {
      const userId = req.user.id;
      const { conversationId } = req.params;

      const messages = await conversationService.getConversationMessages(
        conversationId,
        userId
      );
      
      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error("Erreur récupération messages:", error);
      
      if (error.message.includes("non trouvée") || error.message.includes("non autorisé")) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des messages"
      });
    }
  },

  // Envoyer un message
  async sendMessage(req, res) {
    try {
      const userId = req.user.id;
      const { conversationId } = req.params;
      const { contenu } = req.body;

      if (!contenu || contenu.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "Le contenu du message est requis"
        });
      }

      const message = await conversationService.sendMessage(
        conversationId,
        userId,
        contenu
      );
      
      return res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error("Erreur envoi message:", error);
      
      if (error.message.includes("non trouvée") || error.message.includes("non autorisé")) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi du message"
      });
    }
  },

  // Marquer comme lu
  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { conversationId } = req.params;

      await conversationService.markMessagesAsRead(conversationId, userId);
      
      return res.status(200).json({
        success: true,
        message: "Messages marqués comme lus"
      });
    } catch (error) {
      console.error("Erreur marquage comme lu:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors du marquage des messages"
      });
    }
  },

  // Récupérer les groupes de l'utilisateur
  async getGroups(req, res) {
    try {
      const userId = req.user.id;
      const groups = await conversationService.getUserGroups(userId);

      return res.status(200).json({
        success: true,
        data: groups
      });
    } catch (error) {
      console.error("Erreur récupération groupes:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des groupes"
      });
    }
  },

  // Compter les messages non lus
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await conversationService.getUnreadMessagesCount(userId);

      return res.status(200).json({
        success: true,
        data: { unreadCount: count }
      });
    } catch (error) {
      console.error("Erreur comptage messages non lus:", error);
      return res.status(500).json({
        success: false,
        message: "Erreur lors du comptage des messages non lus"
      });
    }
  },

  // Créer un groupe (alumni uniquement)
async createGroup(req, res) {
  try {
    const adminId = req.user.id;
    const { nom, description, avatar_url, memberIds } = req.body;

    if (!nom) {
      return res.status(400).json({
        success: false,
        message: "Le nom du groupe est requis"
      });
    }

    const result = await conversationService.createGroup(adminId, {
      nom,
      description,
      avatar_url,
      memberIds
    });

    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Erreur création groupe:", error);

    return res.status(403).json({
      success: false,
      message: error.message || "Erreur lors de la création du groupe"
    });
  }
},
  // Rechercher des étudiants
async searchStudents(req, res) {
  try {
    const { query, specialite, interests } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Le paramètre de recherche est requis"
      });
    }

    const students = await conversationService.searchStudents(query, {
      specialite,
      interests: interests ? interests.split(',') : []
    });

    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error("Erreur recherche étudiants:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche des étudiants"
    });
  }
}

};

module.exports = conversationController;