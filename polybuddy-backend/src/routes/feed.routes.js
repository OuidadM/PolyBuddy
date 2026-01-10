// src/routes/feed.routes.js

const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feed.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(authenticate);

/**
 * GET /api/feed/recommendations
 * Obtenir les recommandations personnalisées
 */
router.get('/recommendations', feedController.getRecommendations);

module.exports = router;