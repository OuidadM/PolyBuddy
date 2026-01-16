import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
};

const conversationService = {
  /* =========================
     FRIENDS & CONVERSATIONS
     ========================= */

  // Récupérer tous les amis
  async getFriends() {
    try {
      const response = await axios.get(
        `${API_URL}/conversations/friends`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer ou récupérer une conversation
  async getOrCreateConversation(friendId) {
    try {
      const response = await axios.post(
        `${API_URL}/conversations/create`,
        { friendId },
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer toutes les conversations
  async getUserConversations() {
    try {
      const response = await axios.get(
        `${API_URL}/conversations`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Récupérer les messages d'une conversation
  async getMessages(conversationId) {
    try {
      const response = await axios.get(
        `${API_URL}/conversations/${conversationId}/messages`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Envoyer un message
  async sendMessage(conversationId, contenu) {
    try {
      const response = await axios.post(
        `${API_URL}/conversations/${conversationId}/messages`,
        { contenu },
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Marquer comme lu
  async markAsRead(conversationId) {
    try {
      const response = await axios.put(
        `${API_URL}/conversations/${conversationId}/read`,
        {},
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /* =========================
     GROUPS
     ========================= */

  // Récupérer les groupes
  async getGroups() {
    try {
      const response = await axios.get(
        `${API_URL}/conversations/groups`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Créer un groupe (alumni)
  async createGroup(payload) {
    try {
      const response = await axios.post(
        `${API_URL}/conversations/groups`,
        payload,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /* =========================
     SEARCH
     ========================= */

  // Rechercher des étudiants / alumni
  async searchStudents(params) {
    try {
      const response = await axios.get(
        `${API_URL}/conversations/students/search`,
        {
          ...axiosConfig,
          params
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /* =========================
     NOTIFICATIONS
     ========================= */

  // Compter les messages non lus
  async getUnreadCount() {
    try {
      const response = await axios.get(
        `${API_URL}/conversations/unread-count`,
        axiosConfig
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default conversationService;
