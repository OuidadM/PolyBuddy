// src/controllers/admin.controller.js

const AdminService = require("../services/admin.service");

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
    const verificationStatus = status || 'en_cours';

    // Appel au service
    const students = await AdminService.getStudentsList(verificationStatus);

    return res.status(200).json({
      success: true,
      count: students.length,
      status: verificationStatus,
      data: students
    });

  } catch (error) {
    console.error("❌ Erreur getStudents:", error);
    
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
    // Appel au service
    const stats = await AdminService.getStats();

    return res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error("❌ Erreur getAdminStats:", error);
    
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

    // Appel au service
    const result = await AdminService.approveStudent(id);

    return res.status(200).json(result);

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
    const { reason } = req.body;

    // Appel au service
    const result = await AdminService.rejectStudent(id, reason);

    return res.status(200).json(result);

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
    // Appel au service
    const users = await AdminService.getAllUsers();

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

    // Appel au service
    const result = await AdminService.suspendUser(id);

    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ Erreur suspendUser:", error);
    
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la suspension"
    });
  }
};