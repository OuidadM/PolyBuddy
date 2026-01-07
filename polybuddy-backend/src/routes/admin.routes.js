const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('../controllers/admin.controller');

// Middlewares (auth + rôle admin)
const { authenticate } = require('../middlewares/auth.middleware');
const { authorizeAdmin } = require('../middlewares/role.middleware');

/**
 * ================================
 * 🔐 TOUTES LES ROUTES ADMIN
 * ================================
 * → utilisateur connecté
 * → rôle = admin
 */
router.use(authenticate);
router.use(authorizeAdmin);

/**
 * ================================
 * 👤 ÉTUDIANTS
 * ================================
 */

/**
 * GET /api/admin/students
 * Exemple : /api/admin/students?status=en_cours
 */
router.get('/students', adminController.getStudents);

/**
 * PUT /api/admin/students/:id/approve
 * Valider un étudiant
 */
router.put('/students/:id/approve', adminController.approveStudent);

/**
 * PUT /api/admin/students/:id/reject
 * Rejeter un étudiant
 */
router.put('/students/:id/reject', adminController.rejectStudent);

/**
 * ================================
 * 📊 STATISTIQUES
 * ================================
 */

/**
 * GET /api/admin/stats
 */
router.get('/stats', adminController.getAdminStats);

module.exports = router;
