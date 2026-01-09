const Admin = require('../models/Admin');
const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require("bcrypt");
const StudentService = require('./student.service');
const mailService = require("./mail.service");

class AdminService {
  /**
   * Créer un administrateur
   */
  static async createAdmin(req) {
    const {
      login,
      password,
      nom,
      prenom,
      email,
      nationalite,
      numero,
      langue,
      gender,
      dateNaissance,
      addressId,
      fonction
    } = req.body;

    // Validation basique
    if (!login || !password || !nom || !prenom || !email || !fonction) {
      throw {
        status: 400,
        message: "Tous les champs obligatoires doivent être remplis"
      };
    }

    // Vérifier si le login existe déjà
    const existingUser = await User.findOne({ where: { login: login.toLowerCase() } });
    if (existingUser) {
      throw {
        status: 409,
        message: "Ce login est déjà utilisé"
      };
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      throw {
        status: 409,
        message: "Cet email est déjà utilisé"
      };
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Création du user
    const user = await User.create({
      login,
      passwordHash,
      nom,
      prenom,
      email,
      nationalite,
      numero,
      role: "admin",
      langue: langue || "Français",
      gender,
      dateNaissance,
      addressId: addressId || null,
      account_status: "active"
    });

    // Création de l'admin lié au user
    const admin = await Admin.create({
      id: user.id,
      fonction
    });

    return { user, admin };
  }

  /**
   * Récupérer la liste des étudiants/alumni par statut
   */
  static async getStudentsList(verificationStatus) {
    try {
      return await StudentService.getListStudents(verificationStatus);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des demandes
   */
  static async getStats() {
    try {
      const statuses = ['non_verifie', 'en_cours', 'verifie', 'rejete'];
      const stats = {};

      // Compter pour chaque statut
      for (const status of statuses) {
        const list = await StudentService.getListStudents(status);
        stats[status] = list.length;
      }

      return {
        non_verifie: stats.non_verifie,
        en_cours: stats.en_cours,
        verifie: stats.verifie,
        rejete: stats.rejete,
        total: Object.values(stats).reduce((sum, val) => sum + val, 0)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Approuver une demande d'inscription
   */
  static async approveStudent(studentId) {
  try {
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    });

    if (!student) {
      throw {
        status: 404,
        message: "Étudiant non trouvé"
      };
    }

    if (!student.user) {
      throw {
        status: 500,
        message: "Utilisateur associé introuvable"
      };
    }

    // ✅ Update student
    await student.update({
      verification_status: "verifie",
      verified_at: new Date()
    });

    // ✅ Update user
    await student.user.update({
      account_status: "active"
    });

    console.log("✅ User extrait correctement :", student.user.toJSON());

    // ✅ Envoi email
    await mailService.sendApprovalEmail(student.user);

    return {
      success: true,
      message: "Demande approuvée avec succès"
    };

  } catch (error) {
    console.error("❌ Erreur approveStudent:", error);
    throw error;
  }
}


  /**
   * Rejeter une demande d'inscription
   */
  static async rejectStudent(studentId, reason = null) {
  try {
    // 1️⃣ Récupérer l'étudiant AVEC son user
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: User,
          as: "user"
        }
      ]
    });

    if (!student) {
      throw {
        status: 404,
        message: "Étudiant non trouvé"
      };
    }

    // 2️⃣ Mettre à jour le statut du student
    await student.update({
      verification_status: "rejete",
      verified_at: new Date()
    });

    // 3️⃣ Mettre à jour le compte utilisateur
    await student.user.update({
      account_status: "suspended"
    });

    // 4️⃣ Envoyer l’email de rejet ✅
    await mailService.sendRejectionEmail(student.user, reason);

    return {
      success: true,
      message: "Demande rejetée et email envoyé"
    };

  } catch (error) {
    console.error("❌ Erreur rejectStudent :", error);
    throw error;
  }
}

  /**
   * Récupérer tous les utilisateurs
   */
  static async getAllUsers() {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['passwordHash'] },
        order: [['createdAt', 'DESC']]
      });

      return users;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Suspendre un utilisateur
   */
  static async suspendUser(userId) {
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
        throw {
          status: 404,
          message: "Utilisateur non trouvé"
        };
      }

      await user.update({ account_status: 'suspended' });

      return {
        success: true,
        message: "Utilisateur suspendu"
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AdminService;