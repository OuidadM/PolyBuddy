// src/controllers/adminController.js

const StudentService = require("../services/student.service");
const User = require("../models/User");
const Student = require("../models/Student");

/**
 * ========================================
 * GESTION DES DEMANDES D'INSCRIPTION
 * ========================================
 */

/**
 * Récupérer la liste des étudiants/alumni par statut
 * GET /api/admin/students?status=en_cours
 */
exports.getStudents = async (req, res) => {
  try {
    const { status } = req.query;

    // Valeur par défaut si pas de statut fourni
    const verificationStatus = status || 'en_cours';

    // Appel au service
    const students = await StudentService.getListStudents(verificationStatus);

    return res.status(200).json({
      success: true,
      count: students.length,
      status: verificationStatus,
      data: students
    });

  } catch (error) {
    console.error("❌ Erreur getStudentsList:", error);
    
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la récupération des étudiants"
    });
  }
};

/**
 * Récupérer les statistiques des demandes
 * GET /api/admin/stats
 */
exports.getAdminStats = async (req, res) => {
  try {
    const statuses = ['non_verifie', 'en_cours', 'verifie', 'rejete'];
    const stats = {};

    // Compter pour chaque statut
    for (const status of statuses) {
      const list = await StudentService.getListStudents(status);
      stats[status] = list.length;
    }

    return res.status(200).json({
      success: true,
      stats: {
        non_verifie: stats.non_verifie,
        en_cours: stats.en_cours,
        verifie: stats.verifie,
        rejete: stats.rejete,
        total: Object.values(stats).reduce((sum, val) => sum + val, 0)
      }
    });

  } catch (error) {
    console.error("❌ Erreur getStudentsStats:", error);
    
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la récupération des statistiques"
    });
  }
};

/**
 * Approuver une demande d'inscription
 * PUT /api/admin/students/:id/approve
 */
exports.approveStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Étudiant non trouvé"
      });
    }

    // Mettre à jour le statut
    await student.update({
      verification_status: 'verifie',
      verified_at: new Date()
    });

    // Mettre à jour le compte utilisateur
    await User.update(
      { account_status: 'active' },
      { where: { id } }
    );

    // TODO: Envoyer un email de confirmation
    // await mailService.sendApprovalEmail(student);

    return res.status(200).json({
      success: true,
      message: "Demande approuvée avec succès"
    });

  } catch (error) {
    console.error("❌ Erreur approveStudent:", error);
    
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de l'approbation"
    });
  }
};

/**
 * Rejeter une demande d'inscription
 * PUT /api/admin/students/:id/reject
 */
exports.rejectStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // Raison du rejet (optionnel)

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Étudiant non trouvé"
      });
    }

    // Mettre à jour le statut
    await student.update({
      verification_status: 'rejete',
      verified_at: new Date()
    });

    // Mettre à jour le compte utilisateur
    await User.update(
      { account_status: 'suspended' },
      { where: { id } }
    );

    // TODO: Envoyer un email de rejet
    // await mailService.sendRejectionEmail(student, reason);

    return res.status(200).json({
      success: true,
      message: "Demande rejetée"
    });

  } catch (error) {
    console.error("❌ Erreur rejectStudent:", error);
    
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors du rejet"
    });
  }
};

/**
 * ========================================
 * GESTION DES UTILISATEURS
 * ========================================
 */

/**
 * Récupérer tous les utilisateurs
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error("❌ Erreur getAllUsers:", error);
    
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la récupération des utilisateurs"
    });
  }
};

/**
 * Suspendre un utilisateur
 * PUT /api/admin/users/:id/suspend
 */
exports.suspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Utilisateur non trouvé"
      });
    }

    await user.update({ account_status: 'suspended' });

    return res.status(200).json({
      success: true,
      message: "Utilisateur suspendu"
    });

  } catch (error) {
    console.error("❌ Erreur suspendUser:", error);
    
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la suspension"
    });
  }
};