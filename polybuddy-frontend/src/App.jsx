import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './auth/AuthContext';
import {
  ProtectedRoute,
  AdminRoute,
  PublicRoute
} from './auth/ProtectedRoute';

import LandingPage from './pages/LandingPage/index.jsx'; 
import RegisterPhase1 from './pages/Register/Page1.jsx';
import RegisterPhase2 from './pages/Register/Page2.jsx';
import RegisterPhase3 from './pages/Register/Page3.jsx';
import RegisterStudent from './pages/Register/Student.jsx';
import RegisterAlumni from './pages/Register/Alumni.jsx';
import RegisterSuccess from './pages/Register/RegisterSuccess.jsx';
import Login from './pages/Login/login.jsx';
import Chat from './pages/Chat/index.jsx';
import Feed from './pages/Feed/index.jsx';
import MainLayout from './pages/components/Layout/index.jsx';
import Notifications from './pages/Notifications/index.jsx';

/* =======================
   PROFILS
======================= */
import StudentProfile from './pages/Profile/Student.jsx';
import AlumniProfile from './pages/Profile/Alumni.jsx';

/* =======================
   ADMIN
======================= */
import AdminPanel from './pages/Admin Panel/AdminPanel.jsx';


function App() {
  // Avant d'ajouter les imports
console.log('body overflow:', getComputedStyle(document.body).overflow);
console.log('html overflow:', getComputedStyle(document.documentElement).overflow);

// Après avoir ajouté les imports, rechargez et retapez les mêmes commandes
  return (
    <AuthProvider>
    <div className="App">
      <div className="page">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
        <Route path="/register" element={<RegisterPhase1 />} />
        <Route path="/register/1" element={<RegisterPhase1 />} />
        <Route path="/register/2" element={<RegisterPhase2 />} />
        <Route path="/register/3" element={<RegisterPhase3 />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/alumni" element={<RegisterAlumni />} />
        <Route path="/register/success" element={<RegisterSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
             {/* Fil d'actualité */}
              <Route path="/home" element={<Feed />} />

              {/* Chat - Accessible aux étudiants et alumni */}
              <Route
                path="/chat"
                element={
                  <ProtectedRoute allowedRoles={['student', 'alumni']}>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              {/* Notifications */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute allowedRoles={['student', 'alumni']}>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              {/* Profile étudiant - Accessible uniquement aux étudiants */}
              <Route
                path="/profile/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProfile />
                  </ProtectedRoute>
                }
              />

              {/* Profile alumni - Accessible uniquement aux alumni */}
              <Route
                path="/profile/alumni"
                element={
                  <ProtectedRoute allowedRoles={['alumni']}>
                    <AlumniProfile />
                  </ProtectedRoute>
                }
              />

              {/* Route /profile qui redirige automatiquement selon le rôle */}
              <Route
                path="/profile"
                element={<ProfileRedirect />}
              />
            </Route>

            {/* =========================
                ROUTES ADMIN
            ========================== */}
            <Route
              path="/admin/home"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />

            {/* =========================
                404
            ========================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </div>
    </AuthProvider>
  );
}

/**
 * Composant qui redirige vers le bon profil selon le rôle
 */
function ProfileRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'student') {
    return <Navigate to="/profile/student" replace />;
  }

  if (user.role === 'alumni') {
    return <Navigate to="/profile/alumni" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/home" replace />;
  }

  return <Navigate to="/home" replace />;
}


export default App;