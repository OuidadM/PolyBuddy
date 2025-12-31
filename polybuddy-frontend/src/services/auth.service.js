import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authService = {
  register: async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          withCredentials: true // OBLIGATOIRE pour les cookies
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur register :", error);

      // Gestion propre des erreurs backend
      if (error.response && error.response.data) {
        throw error.response.data;
      }

      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials,
        {
          withCredentials: true // OBLIGATOIRE pour recevoir le JWT dans un cookie HttpOnly
        }
      );

      // Le token JWT est automatiquement stocké dans un cookie HttpOnly par le backend
      // On retourne juste les données utilisateur
      return response.data;
    } catch (error) {
      console.error("❌ Erreur login :", error);

      // Gestion propre des erreurs backend
      if (error.response && error.response.data) {
        throw error.response.data;
      }

      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true // OBLIGATOIRE pour supprimer le cookie
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur logout :", error);
      throw error;
    }
  },

  // Vérifier si l'utilisateur est toujours connecté (en validant le JWT)
  checkAuth: async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          withCredentials: true // Le JWT est envoyé automatiquement via le cookie
        }
      );

      return response.data;
    } catch (error) {
      console.error("❌ Erreur checkAuth :", error);
      throw error;
    }
  }
};

export default authService;