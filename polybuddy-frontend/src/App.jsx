import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

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

function App() {
  return (
    <div className="App">
      <div className="page">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register/1" element={<RegisterPhase1 />} />
        <Route path="/register/2" element={<RegisterPhase2 />} />
        <Route path="/register/3" element={<RegisterPhase3 />} />
        <Route path="/register/student" element={<RegisterStudent />} />
        <Route path="/register/alumni" element={<RegisterAlumni />} />
        <Route path="/register/success" element={<RegisterSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
           <Route path="/app" element={<Navigate to="/home" replace />} />

           <Route path="/home" element={<Feed />} />
           <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
      </div>
    </div>
  );
}

export default App;