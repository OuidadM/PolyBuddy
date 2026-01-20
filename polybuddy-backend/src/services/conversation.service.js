// src/services/conversation.service.js
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Student = require('../models/Student');
const User = require('../models/User');
const Alumni = require('../models/Alumni');
const Friendship = require('../models/Friendship');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

const conversationService = {
  // Récupérer tous les amis de l'utilisateur
  async getFriends(userId) {
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, status: 'accepted' },
          { friend_id: userId, status: 'accepted' }
        ]
      }
    });

    const friendIds = friendships.map(f => 
      f.user_id === userId ? f.friend_id : f.user_id
    );

    const friends = await Student.findAll({
      where: { id: { [Op.in]: friendIds } },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'avatar_url', 'role']
        },
        {
          model: Alumni,
          as: 'alumni',
          attributes: ['entreprise', 'position'],
          required: false
        }
      ]
    });

    return friends.map(friend => ({
      id: friend.id,
      name: `${friend.user.prenom} ${friend.user.nom}`,
      avatar: friend.user.avatar_url,
      role: friend.user.role,
      specialite: friend.specialite,
      entreprise: friend.alumni?.entreprise,
      isAlumni: friend.user.role === 'alumni'
    }));
  },

  // Créer ou récupérer une conversation directe entre deux utilisateurs
  async getOrCreateDirectConversation(user1Id, user2Id) {
    const existingConv = await Conversation.findOne({
      where: { type: 'direct' },
      include: [
        {
          model: Student,
          as: 'participants',
          where: {
            id: { [Op.in]: [user1Id, user2Id] }
          },
          through: { attributes: [] }
        }
      ]
    });

    if (existingConv && existingConv.participants.length === 2) {
      return existingConv;
    }

    const newConv = await Conversation.create({
      type: 'direct',
      date_creation: new Date()
    });

    await newConv.addParticipants([user1Id, user2Id]);

    return newConv;
  },

  // Récupérer toutes les conversations d'un utilisateur
  async getUserConversations(userId) {
    const conversations = await Conversation.findAll({
      include: [
        {
          model: Student,
          as: 'participants',
          required: true,
          through: { attributes: [] },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nom', 'prenom', 'avatar_url', 'role']
            }
          ]
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['date_envoi', 'DESC']],
          include: [
            {
              model: Student,
              as: 'expediteur',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['nom', 'prenom']
                }
              ]
            }
          ]
        }
      ],
      where: {
        '$participants.id$': userId
      },
      order: [[{ model: Message, as: 'messages' }, 'date_envoi', 'DESC']]
    });

    return conversations.map(conv => {
      const otherParticipant = conv.participants.find(p => p.id !== userId);
      const lastMessage = conv.messages[0];

      return {
        id: conv.id_conv,
        type: conv.type,
        participant: otherParticipant ? {
          id: otherParticipant.id,
          name: `${otherParticipant.user.prenom} ${otherParticipant.user.nom}`,
          avatar: otherParticipant.user.avatar_url,
          role: otherParticipant.user.role
        } : null,
        lastMessage: lastMessage ? {
          text: lastMessage.contenu,
          time: lastMessage.date_envoi,
          isRead: lastMessage.etat === 'lu',
          isSent: lastMessage.expediteurId === userId
        } : null
      };
    });
  },

  // Récupérer les messages d'une conversation
  async getConversationMessages(conversationId, userId) {
    const conversation = await Conversation.findByPk(conversationId, {
      include: [
        {
          model: Student,
          as: 'participants',
          where: { id: userId },
          required: true
        }
      ]
    });

    if (!conversation) {
      throw new Error("Conversation non trouvée ou accès non autorisé");
    }

    const messages = await Message.findAll({
      where: { conversationId },
      include: [
        {
          model: Student,
          as: 'expediteur',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['nom', 'prenom', 'avatar_url']
            }
          ]
        }
      ],
      order: [['date_envoi', 'ASC']]
    });

    return messages.map(msg => ({
      id: msg.id_message,
      text: msg.contenu,
      time: msg.date_envoi,
      sent: msg.expediteurId === userId,
      read: msg.etat === 'lu',
      sender: {
        id: msg.expediteur.id,
        name: `${msg.expediteur.user.prenom} ${msg.expediteur.user.nom}`,
        avatar: msg.expediteur.user.avatar_url
      }
    }));
  },

  // Envoyer un message
  async sendMessage(conversationId, userId, contenu) {
    const conversation = await Conversation.findByPk(conversationId, {
      include: [
        {
          model: Student,
          as: 'participants',
          where: { id: userId },
          required: true
        }
      ]
    });

    if (!conversation) {
      throw new Error("Conversation non trouvée ou accès non autorisé");
    }

    const message = await Message.create({
      conversationId,
      expediteurId: userId,
      contenu,
      etat: 'envoye',
      date_envoi: new Date()
    });

    return message;
  },

  // Marquer les messages comme lus
  async markMessagesAsRead(conversationId, userId) {
    await Message.update(
      { etat: 'lu' },
      {
        where: {
          conversationId,
          expediteurId: { [Op.ne]: userId },
          etat: 'envoye'
        }
      }
    );
  },

  // Récupérer les groupes de l'utilisateur
  async getUserGroups(userId) {
    const groups = await Conversation.findAll({
      where: { type: 'groupe' }, // ✅ FIX: 'groupe' au lieu de 'group'
      include: [
        {
          model: Student,
          as: 'participants',
          required: true,
          where: { id: userId },
          through: { attributes: [] }
        },
        {
          model: Message,
          as: 'messages',
          separate: true, // ✅ FIX: Permet d'utiliser limit et order
          limit: 1,
          order: [['date_envoi', 'DESC']]
        }
      ]
    });

    return groups.map(group => ({
      id: group.id_conv,
      name: group.nom || 'Groupe',
      avatar: group.avatar_url || null, // ✅ FIX: Ajout de l'avatar si disponible
      lastMessage: group.messages && group.messages[0] ? group.messages[0].contenu : '',
      type: 'groupe'
    }));
  },

  // Compter les messages non lus pour un utilisateur
  async getUnreadMessagesCount(userId) {
    const conversations = await Conversation.findAll({
      include: [
        {
          model: Student,
          as: 'participants',
          where: { id: userId },
          required: true,
          through: { attributes: [] }
        }
      ]
    });

    const conversationIds = conversations.map(c => c.id_conv);

    const unreadCount = await Message.count({
      where: {
        conversationId: { [Op.in]: conversationIds },
        expediteurId: { [Op.ne]: userId },
        etat: 'envoye'
      }
    });

    return unreadCount;
  },

  // Créer un groupe (réservé aux alumni)
  async createGroup(adminId, { nom, description, avatar, members }) {
    const Group = require('../models/Group');

    // Vérifier que l'admin est bien un alumni
    const admin = await User.findByPk(adminId);
    if (!admin || admin.role !== 'alumni') {
      throw new Error("Seuls les alumni peuvent créer des groupes");
    }

    // Créer la conversation du groupe
    const conversation = await Conversation.create({
      type: 'groupe',
      nom,
      date_creation: new Date()
    });

    // Créer le groupe
    const group = await Group.create({
      nom,
      description: description || null,
      avatar_url: avatar || null,
      adminId,
      conversationId: conversation.id_conv,
      actif: true
    });

    // Ajouter l'admin comme participant
    await conversation.addParticipants([adminId]);

    // Ajouter les membres sélectionnés
    if (members && members.length > 0) {
      await conversation.addParticipants(members);
    }

    return {
      group,
      conversation
    };
  },

  // ✅ NOUVELLE VERSION - Rechercher des étudiants avec filtres complets
  async searchStudents(query, filters = {}) {
    const { role, specialite, niveau, gender } = filters;
    
    // Clause WHERE pour Student
    const studentWhere = {
      verification_status: 'verifie'
    };

    if (specialite) {
      studentWhere.specialite = specialite.toLowerCase();
    }

    if (niveau) {
      studentWhere.niveau = parseInt(niveau);
    }

    // Clause WHERE pour User
    const userWhere = {
      account_status: 'active',
      [Op.or]: [
        { nom: { [Op.iLike]: `%${query}%` } },
        { prenom: { [Op.iLike]: `%${query}%` } }
      ]
    };

    if (role) {
      userWhere.role = role;
    }

    if (gender) {
      userWhere.gender = gender;
    }

    const students = await Student.findAll({
      where: studentWhere,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'nom', 'prenom', 'avatar_url', 'role', 'gender'],
          where: userWhere
        },
        {
          model: Alumni,
          as: 'alumni',
          attributes: ['position', 'entreprise'],
          required: false
        }
      ],
      limit: 50
    });

    return students.map(student => ({
      id: student.id,
      nom: student.user.nom,
      prenom: student.user.prenom,
      avatar_url: student.user.avatar_url,
      role: student.user.role,
      specialite: student.specialite,
      niveau: student.niveau,
      gender: student.user.gender,
      position: student.alumni?.position,
      entreprise: student.alumni?.entreprise
    }));
  }
};

module.exports = conversationService;