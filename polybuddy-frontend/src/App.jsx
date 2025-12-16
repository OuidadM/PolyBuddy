import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage/index.jsx'; 
import Register from './pages/Register/page1.jsx';
import Login from './pages/Login/login.jsx';
import Chat from './pages/Chat/index.jsx';
import Feed from './pages/Feed/index.jsx';
import MainLayout from './pages/components/Layout/index.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
           <Route path="/app" element={<Navigate to="/home" replace />} />

           <Route path="/home" element={<Feed />} />
           <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;