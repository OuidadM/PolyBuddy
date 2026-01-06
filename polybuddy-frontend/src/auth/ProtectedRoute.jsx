import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * ProtectedRoute - Protège les routes nécessitant une authentification
 * 
 * @param {React.ReactNode} children - Le composant à protéger
 * @param {string[]} allowedRoles - Les rôles autorisés (optionnel)
 * 
 * Exemple d'utilisation dans App.jsx :
 * 
 * <Route 
 *   path="/home" 
 *   element={
 *     <ProtectedRoute>
 *       <Home />
 *     </ProtectedRoute>
 *   } 
 * />
 * 
 * Avec rôles spécifiques :
 * <Route 
 *   path="/chat" 
 *   element={
 *     <ProtectedRoute allowedRoles={["student", "alumni"]}>
 *       <Chat />
 *     </ProtectedRoute>
 *   } 
 * />
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // 1️⃣ Pendant le chargement (vérification du JWT)
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e0e0e0',
          borderTop: '5px solid #1D3039',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ 
          marginTop: '20px',
          fontSize: '18px',
          color: '#1D3039'
        }}>
          Vérification...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 2️⃣ Si pas connecté → Redirection vers /login
  if (!isAuthenticated) {
    console.log("🔒 Accès refusé: utilisateur non connecté");
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Si des rôles spécifiques sont requis
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`🚫 Accès refusé: rôle ${user.role} non autorisé`);
    
    // Rediriger vers la page appropriée selon son rôle
    if (user.role === "admin") {
      return <Navigate to="/admin/home" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  // 4️⃣ Tout est OK → Afficher la page
  console.log(`✅ Accès autorisé: ${user.prenom} (${user.role})`);
  return children;
};

/**
 * AdminRoute - Route accessible uniquement aux admins
 * 
 * Exemple :
 * <Route 
 *   path="/admin/dashboard" 
 *   element={
 *     <AdminRoute>
 *       <AdminDashboard />
 *     </AdminRoute>
 *   } 
 * />
 */
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * StudentRoute - Route accessible uniquement aux étudiants
 * 
 * Exemple :
 * <Route 
 *   path="/student/profile" 
 *   element={
 *     <StudentRoute>
 *       <StudentProfile />
 *     </StudentRoute>
 *   } 
 * />
 */
export const StudentRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * AlumniRoute - Route accessible uniquement aux alumni
 * 
 * Exemple :
 * <Route 
 *   path="/alumni/network" 
 *   element={
 *     <AlumniRoute>
 *       <AlumniNetwork />
 *     </AlumniRoute>
 *   } 
 * />
 */
export const AlumniRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["alumni"]}>
      {children}
    </ProtectedRoute>
  );
};

/**
 * PublicRoute - Route accessible uniquement si NON connecté
 * (Utile pour Login/Register - éviter qu'un user connecté y accède)
 * 
 * Exemple :
 * <Route 
 *   path="/login" 
 *   element={
 *     <PublicRoute>
 *       <Login />
 *     </PublicRoute>
 *   } 
 * />
 */
export const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Si déjà connecté, rediriger vers sa page d'accueil
  if (isAuthenticated) {
    if (user.role === "admin") {
      return <Navigate to="/admin/home" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
};