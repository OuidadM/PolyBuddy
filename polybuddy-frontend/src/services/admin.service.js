// src/services/admin.service.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const adminService = {
  /**
   * Récupérer la liste des étudiants/alumni par statut
   * @param {string} status - 'non_verifie', 'en_cours', 'verifie', 'rejete'
   */
  getStudents: async (status = 'en_cours') => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/students`,
        {
          params: { status },
          withCredentials: true // OBLIGATOIRE pour envoyer le JWT
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur getStudents:", error);
      
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      
      throw error;
    }
  },

  /**
   * Récupérer les statistiques des demandes
   */
  getStats: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/admin/stats`,
        {
          withCredentials: true
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur getStats:", error);
      
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      
      throw error;
    }
  },

  /**
   * Approuver un étudiant
   * @param {string} id - ID de l'étudiant
   */
  approveStudent: async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/students/${id}/approve`,
        {},
        {
          withCredentials: true
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur approveStudent:", error);
      
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      
      throw error;
    }
  },

  /**
   * Rejeter un étudiant
   * @param {string} id - ID de l'étudiant
   * @param {string} reason - Raison du rejet (optionnel)
   */
  rejectStudent: async (id, reason = null) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/students/${id}/reject`,
        { reason },
        {
          withCredentials: true
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur rejectStudent:", error);
      
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      
      throw error;
    }
  }
};

export default adminService;