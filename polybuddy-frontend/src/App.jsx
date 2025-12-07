import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage/index.jsx'; 
import Chat from './pages/Chat/index.jsx';
import Feed from './pages/Feed/index.jsx';
import MainLayout from './pages/components/Layout/index.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />

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