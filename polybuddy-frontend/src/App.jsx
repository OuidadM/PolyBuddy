import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

/* =======================
   AUTH
======================= */
import { AuthProvider } from './auth/AuthContext';
import {
  ProtectedRoute,
  AdminRoute,
  StudentRoute,
  AlumniRoute,
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
   ADMIN
======================= */
import AdminPanel from './pages/Admin Panel/AdminPanel.jsx';
//import AdminDashboard from './pages/Admin/Dashboard';

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

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPhase1 />
              </PublicRoute>
            }
          />
          <Route path="/register/1" element={<RegisterPhase1 />} />
          <Route path="/register/2" element={<RegisterPhase2 />} />
          <Route path="/register/3" element={<RegisterPhase3 />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/alumni" element={<RegisterAlumni />} />
          <Route path="/register/success" element={<RegisterSuccess />} />

          {/* =========================
              ROUTES PROTÉGÉES (layout)
          ========================== */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Feed />} />

            <Route
              path="/chat"
              element={
                <ProtectedRoute allowedRoles={['student', 'alumni']}>
                  <Chat />
                </ProtectedRoute>
              }
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
          {/*<Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />*/}

          {/* =========================
              404
          ========================== */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
