import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import CreateAccount from './pages/CreateAccount/CreateAccount'
import Laureat from './pages/Laureat/Laureat'
import RegisterPhase2 from './pages/RegisterPhase2/RegisterPhase2'
import RegisterPhase3 from './pages/RegisterPhase3/RegisterPhase3'

export default function App() {

  // 🔥 FORM DATA CENTRALISÉ ICI
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    birthday: "",
    gender: "",
    interests: [],  // important pour éviter les crashes
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/create-account' element={<CreateAccount />} />
        <Route path='/laureat' element={<Laureat />} />

        {/* 🔥 On passe formData et setFormData aux phases */}
        <Route
          path='/register-phase-2'
          element={<RegisterPhase2 formData={formData} setFormData={setFormData} />}
        />

        <Route
          path='/register-phase-3'
          element={<RegisterPhase3 formData={formData} setFormData={setFormData} />}
        />
      </Routes>
    </BrowserRouter>
  )
}
