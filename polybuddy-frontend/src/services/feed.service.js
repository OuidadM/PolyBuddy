// src/services/feed.service.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const feedService = {
  /**
   * Récupérer les recommandations personnalisées
   */
  getRecommendations: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/feed/recommendations`,
        {
          withCredentials: true
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur getRecommendations:", error);

      if (error.response && error.response.data) {
        throw error.response.data;
      }

      throw error;
    }
  }
};

export default feedService;