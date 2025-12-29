import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authService = {
  register: async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        {
          withCredentials: true // OBLIGATOIRE
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
};

export default authService;
