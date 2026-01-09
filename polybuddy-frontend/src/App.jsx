import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { useAuth } from './auth/AuthContext';

/* =======================
   AUTH
======================= */
import { AuthProvider } from './auth/AuthContext';
import {
  ProtectedRoute,
  AdminRoute,
  PublicRoute
} from './auth/ProtectedRoute';

/* =======================
   PAGES PUBLIQUES
======================= */
import LandingPage from './pages/LandingPage';
import Login from './pages/Login/Login.jsx';

/* Register */
import RegisterPhase1 from './pages/Register/Page1.jsx';
import RegisterPhase2 from './pages/Register/Page2.jsx';
import RegisterPhase3 from './pages/Register/Page3.jsx';
import RegisterStudent from './pages/Register/Student.jsx';
import RegisterAlumni from './pages/Register/Alumni.jsx';
import RegisterSuccess from './pages/Register/RegisterSuccess.jsx';

/* =======================
   PAGES PROTÉGÉES
======================= */
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import MainLayout from './pages/components/Layout';

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
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* =========================
              ROUTES PUBLIQUES
          ========================== */}
          <Route path="/" element={<LandingPage />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Routes d'inscription */}
          <Route path="/register" element={<RegisterPhase1 />} />
          <Route path="/register/1" element={<RegisterPhase1 />} />
          <Route path="/register/2" element={<RegisterPhase2 />} />
          <Route path="/register/3" element={<RegisterPhase3 />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/alumni" element={<RegisterAlumni />} />
          <Route path="/register/success" element={<RegisterSuccess />} />

          {/* =========================
              ROUTES PROTÉGÉES (avec MainLayout)
          ========================== */}
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
      </AuthProvider>
    </BrowserRouter>
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