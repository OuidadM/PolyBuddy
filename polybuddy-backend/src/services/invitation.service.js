// src/services/invitation.service.js
const Invitation = require('../models/Invitation');
const Friendship = require('../models/Friendship');
const User = require('../models/User');
const Student = require('../models/Student');
const Alumni = require('../models/Alumni');
const { Op } = require('sequelize');

const invitationService = {
  // Envoyer une invitation
  async sendInvitation(expediteurId, destinataireId) {
    // Vérifier si les deux étudiants existent
    const [expediteur, destinataire] = await Promise.all([
      Student.findByPk(expediteurId),
      Student.findByPk(destinataireId)
    ]);

    if (!expediteur || !destinataire) {
      throw new Error("Un ou plusieurs utilisateurs n'existent pas");
    }

    // Vérifier s'ils sont déjà amis
    const existingFriendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { user_id: expediteurId, friend_id: destinataireId, status: 'accepted' },
          { user_id: destinataireId, friend_id: expediteurId, status: 'accepted' }
        ]
      }
    });

    if (existingFriendship) {
      throw new Error("Vous êtes déjà amis avec cet utilisateur");
    }

    // Vérifier s'il existe déjà une invitation en attente
    const existingInvitation = await Invitation.findOne({
      where: {
        [Op.or]: [
          { expediteurId, destinataireId, etat: 'en_attente' },
          { expediteurId: destinataireId, destinataireId: expediteurId, etat: 'en_attente' }
        ]
      }
    });

    if (existingInvitation) {
      if (existingInvitation.expediteurId === expediteurId) {
        throw new Error("Vous avez déjà envoyé une invitation à cet utilisateur. Votre demande est en attente.");
      } else {
        throw new Error("Cet utilisateur vous a déjà envoyé une invitation");
      }
    }

    // Créer l'invitation
    const invitation = await Invitation.create({
      expediteurId,
      destinataireId,
      etat: 'en_attente'
    });

    return invitation;
  },

  // Récupérer les invitations reçues
  async getReceivedInvitations(userId) {
    const invitations = await Invitation.findAll({
      where: {
        destinataireId: userId,
        etat: 'en_attente'
      },
      include: [
        {
          model: Student,
          as: 'expediteur',
          attributes: ['id', 'specialite', 'niveau'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nom', 'prenom', 'avatar_url', 'role']
            },
            {
              model: Alumni,
              as: 'alumni',
              attributes: ['entreprise', 'position', 'annee_diplome'],
              required: false
            }
          ]
        }
      ],
      order: [['date_envoi', 'DESC']]
    });

    // Formatter les données
    return invitations.map(inv => {
      const expediteur = inv.expediteur;
      const user = expediteur?.user;
      const alumni = expediteur?.alumni;

      return {
        id: inv.id_invitation,
        expediteur: {
          id: user?.id,
          nom: user?.nom,
          prenom: user?.prenom,
          name: `${user?.prenom} ${user?.nom}`,
          avatar_url: user?.avatar_url,
          role: user?.role,
          specialite: expediteur?.specialite,
          niveau: expediteur?.niveau,
          entreprise: alumni?.entreprise,
          position: alumni?.position,
          isAlumni: user?.role === 'alumni'
        },
        date_envoi: inv.date_envoi,
        etat: inv.etat
      };
    });
  },

  // Récupérer les invitations envoyées
  async getSentInvitations(userId) {
    const invitations = await Invitation.findAll({
      where: {
        expediteurId: userId,
        etat: 'en_attente'
      },
      include: [
        {
          model: Student,
          as: 'destinataire',
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'nom', 'prenom', 'avatar_url', 'role']
            }
          ]
        }
      ],
      order: [['date_envoi', 'DESC']]
    });

    return invitations.map(inv => ({
      id: inv.id_invitation,
      destinataire: {
        id: inv.destinataire?.user?.id,
        name: `${inv.destinataire?.user?.prenom} ${inv.destinataire?.user?.nom}`,
        avatar_url: inv.destinataire?.user?.avatar_url,
        role: inv.destinataire?.user?.role
      },
      date_envoi: inv.date_envoi,
      etat: inv.etat
    }));
  },

  // Accepter une invitation
  async acceptInvitation(invitationId, userId) {
    const invitation = await Invitation.findByPk(invitationId);

    if (!invitation) {
      throw new Error("Invitation non trouvée");
    }

    if (invitation.destinataireId !== userId) {
      throw new Error("Vous n'êtes pas le destinataire de cette invitation");
    }

    if (invitation.etat !== 'en_attente') {
      throw new Error("Cette invitation a déjà été traitée");
    }

    // Vérifier si le modèle Friendship existe, sinon le créer
    let Friendship;
    try {
      Friendship = require('../models/Friendship');
    } catch (error) {
      // Le modèle Friendship n'existe pas encore, on va le créer
      console.warn("Modèle Friendship non trouvé, création en attente...");
    }

    // Mettre à jour l'invitation
    invitation.etat = 'acceptee';
    await invitation.save();

    // Créer l'amitié si le modèle existe
    if (Friendship) {
      await Friendship.create({
        user_id: invitation.expediteurId,
        friend_id: invitation.destinataireId,
        status: 'accepted'
      });
    }

    return invitation;
  },

  // Supprimer une invitation
  async deleteInvitation(invitationId, userId) {
    const invitation = await Invitation.findByPk(invitationId);

    if (!invitation) {
      throw new Error("Invitation non trouvée");
    }

    // Vérifier que l'utilisateur est soit l'expéditeur soit le destinataire
    if (invitation.expediteurId !== userId && invitation.destinataireId !== userId) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cette invitation");
    }

    // Si c'est le destinataire qui supprime, on considère que c'est un refus
    if (invitation.destinataireId === userId && invitation.etat === 'en_attente') {
      invitation.etat = 'refusee';
      await invitation.save();
    }

    // Supprimer l'invitation
    await invitation.destroy();
  },

  // Vérifier le statut entre deux utilisateurs
  async checkInvitationStatus(userId, targetUserId) {
    // Vérifier s'ils sont amis
    let Friendship;
    try {
      Friendship = require('../models/Friendship');
      const friendship = await Friendship.findOne({
        where: {
          [Op.or]: [
            { user_id: userId, friend_id: targetUserId, status: 'accepted' },
            { user_id: targetUserId, friend_id: userId, status: 'accepted' }
          ]
        }
      });

      if (friendship) {
        return { status: 'friends' };
      }
    } catch (error) {
      console.warn("Modèle Friendship non disponible");
    }

    // Vérifier s'il existe une invitation en attente
    const invitation = await Invitation.findOne({
      where: {
        [Op.or]: [
          { expediteurId: userId, destinataireId: targetUserId, etat: 'en_attente' },
          { expediteurId: targetUserId, destinataireId: userId, etat: 'en_attente' }
        ]
      }
    });

    if (invitation) {
      if (invitation.expediteurId === userId) {
        return { 
          status: 'pending_sent',
          invitationId: invitation.id_invitation
        };
      } else {
        return { 
          status: 'pending_received',
          invitationId: invitation.id_invitation
        };
      }
    }

    return { status: 'none' };
  }
};

module.exports = invitationService;