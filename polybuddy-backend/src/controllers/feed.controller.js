// src/controllers/feed.controller.js

const FeedService = require("../services/feed.service");

/**
 * Obtenir les recommandations pour le feed
 * GET /api/feed/recommendations
 */
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id; // Injecté par le middleware authenticate

    const recommendations = await FeedService.getRecommendations(userId);

    return res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error("❌ Erreur getRecommendations:", error);

    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la récupération des recommandations"
    });
  }
};