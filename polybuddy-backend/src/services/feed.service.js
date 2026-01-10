// src/services/feed.service.js

const User = require("../models/User");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");
const Friendship = require("../models/Friendship");
const { Op } = require("sequelize");

class FeedService {
  /**
   * Obtenir les recommandations personnalisées pour l'utilisateur connecté
   * @param {string} userId - ID de l'utilisateur connecté
   */
  static async getRecommendations(userId) {
    try {
      // Récupérer l'utilisateur avec ses infos student/alumni
      const currentUser = await User.findByPk(userId, {
        include: [
          {
            model: Student,
            as: "student",
            include: [
              {
                model: Alumni,
                as: "alumni",
                required: false
              }
            ]
          }
        ]
      });

      if (!currentUser || !currentUser.student) {
        return {
          sameSpecialty: [],
          alumniSpecialty: [],
          sharedInterests: []
        };
      }

      const userSpecialty = currentUser.student.specialite;
      const userInterests = currentUser.student.centres_interet || [];

      // Récupérer les IDs des amis existants
      const friendIds = await this.getFriendIds(userId);
      const excludeIds = [...friendIds, userId];

      // 1️⃣ Étudiants de la même spécialité (non-alumni)
      const sameSpecialty = await this.getSameSpecialtyStudents(
        userSpecialty,
        excludeIds
      );

      // 2️⃣ Alumni de la même spécialité
      const alumniSpecialty = await this.getAlumniBySpecialty(
        userSpecialty,
        excludeIds
      );

      // 3️⃣ Personnes partageant au moins un centre d'intérêt
      const sharedInterests = await this.getUsersBySharedInterests(
        userInterests,
        excludeIds
      );

      return {
        sameSpecialty,
        alumniSpecialty,
        sharedInterests
      };
    } catch (error) {
      console.error("❌ Erreur getRecommendations:", error);
      throw error;
    }
  }

  /**
   * Récupérer les IDs des amis de l'utilisateur
   */
  static async getFriendIds(userId) {
    const friendships = await Friendship.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, status: "accepted" },
          { friend_id: userId, status: "accepted" }
        ]
      },
      attributes: ["user_id", "friend_id"]
    });

    return friendships.map((f) =>
      f.user_id === userId ? f.friend_id : f.user_id
    );
  }

  /**
   * Compter le nombre d'amis d'un utilisateur
   */
  static async countFriends(userId) {
    const count = await Friendship.count({
      where: {
        [Op.or]: [
          { user_id: userId, status: "accepted" },
          { friend_id: userId, status: "accepted" }
        ]
      }
    });

    return count;
  }

  /**
   * Étudiants de la même spécialité (non-alumni)
   */
  static async getSameSpecialtyStudents(specialty, excludeIds) {
    const students = await Student.findAll({
      where: {
        specialite: specialty,
        id: { [Op.notIn]: excludeIds },
        verification_status: "verifie"
      },
      include: [
        {
          model: User,
          as: "user",
          where: {
            account_status: "active",
            role: "student"
          },
          attributes: ["id", "prenom", "nom", "avatar_url"]
        },
        {
          model: Alumni,
          as: "alumni",
          required: false,
          where: { id: null } // Exclure les alumni
        }
      ],
      limit: 10
    });

    return Promise.all(
      students.map(async (s) => ({
        id: s.user.id,
        name: `${s.user.prenom} ${s.user.nom}`,
        role: s.niveau ? `Étudiant - Niveau ${s.niveau}` : "Étudiant",
        specialite: s.specialite,
        avatar_url: s.user.avatar_url,
        isAlumni: false,
        mutualFriends: await this.countFriends(s.user.id)
      }))
    );
  }

  /**
   * Alumni de la même spécialité
   */
  static async getAlumniBySpecialty(specialty, excludeIds) {
    const alumni = await Student.findAll({
      where: {
        specialite: specialty,
        id: { [Op.notIn]: excludeIds },
        verification_status: "verifie"
      },
      include: [
        {
          model: User,
          as: "user",
          where: {
            account_status: "active",
            role: "alumni"
          },
          attributes: ["id", "prenom", "nom", "avatar_url"]
        },
        {
          model: Alumni,
          as: "alumni",
          required: true,
          attributes: ["annee_diplome", "position", "entreprise"]
        }
      ],
      limit: 10
    });

    return Promise.all(
      alumni.map(async (a) => ({
        id: a.user.id,
        name: `${a.user.prenom} ${a.user.nom}`,
        role: a.alumni.position || "Alumni",
        specialite: a.specialite,
        entreprise: a.alumni.entreprise,
        annee_diplome: a.alumni.annee_diplome,
        avatar_url: a.user.avatar_url,
        isAlumni: true,
        mutualFriends: await this.countFriends(a.user.id)
      }))
    );
  }

  /**
   * Utilisateurs partageant au moins un centre d'intérêt
   */
  static async getUsersBySharedInterests(userInterests, excludeIds) {
    if (!userInterests || userInterests.length === 0) {
      return [];
    }

    const users = await Student.findAll({
      where: {
        id: { [Op.notIn]: excludeIds },
        verification_status: "verifie",
        centres_interet: {
          [Op.overlap]: userInterests // PostgreSQL array overlap
        }
      },
      include: [
        {
          model: User,
          as: "user",
          where: { account_status: "active" },
          attributes: ["id", "prenom", "nom", "avatar_url", "role"]
        },
        {
          model: Alumni,
          as: "alumni",
          required: false,
          attributes: ["annee_diplome", "position", "entreprise"]
        }
      ],
      limit: 10
    });

    return Promise.all(
      users.map(async (u) => {
        const sharedInterests = u.centres_interet.filter((i) =>
          userInterests.includes(i)
        );

        return {
          id: u.user.id,
          name: `${u.user.prenom} ${u.user.nom}`,
          role: u.user.role === "alumni" 
            ? u.alumni?.position || "Alumni"
            : u.niveau ? `Étudiant - Niveau ${u.niveau}` : "Étudiant",
          specialite: u.specialite,
          avatar_url: u.user.avatar_url,
          isAlumni: u.user.role === "alumni",
          sharedInterests: sharedInterests,
          sharedInterestsCount: sharedInterests.length,
          mutualFriends: await this.countFriends(u.user.id)
        };
      })
    );
  }
}

module.exports = FeedService;