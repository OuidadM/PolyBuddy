import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

// 1️⃣ Créer le Context
const AuthContext = createContext();

// 2️⃣ Hook personnalisé pour utiliser le Context facilement
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// 3️⃣ Provider qui enveloppe toute l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 4️⃣ Vérifier si l'utilisateur est déjà connecté au chargement de l'app
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Vérifie si l'utilisateur est connecté (via le JWT dans le cookie)
   */
  const checkAuthStatus = async () => {
    try {
      const response = await authService.checkAuth();
      setUser(response.user);
      console.log("✅ Utilisateur connecté:", response.user);
    } catch (error) {
      console.log("❌ Utilisateur non connecté");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion de l'utilisateur
   */
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      
      console.log("✅ Login réussi:", response.user);
      
      // Redirection basée sur le rôle
      if (response.user.role === "admin") {
        navigate('/admin/home');
      } else {
        navigate('/home');
      }
      
      return response;
    } catch (error) {
      console.error("❌ Erreur login:", error);
      throw error;
    }
  };

  /**
   * Déconnexion de l'utilisateur
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
      console.log("✅ Déconnexion réussie");
    } catch (error) {
      console.error("❌ Erreur logout:", error);
      // Même en cas d'erreur, on déconnecte côté front
      setUser(null);
      navigate('/login');
    }
  };

  /**
   * Mettre à jour les informations de l'utilisateur
   */
  const updateUser = (updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData
    }));
  };

  // 5️⃣ Valeurs disponibles dans toute l'application
  const value = {
    user,                              // Données de l'utilisateur connecté
    loading,                           // État de chargement
    login,                             // Fonction pour se connecter
    logout,                            // Fonction pour se déconnecter
    updateUser,                        // Fonction pour mettre à jour l'user
    isAuthenticated: !!user,           // Booléen: est connecté ?
    isAdmin: user?.role === "admin",   // Booléen: est admin ?
    isStudent: user?.role === "student", // Booléen: est étudiant ?
    isAlumni: user?.role === "alumni"  // Booléen: est alumni ?
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};