// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const profileRoutes = require("./routes/profile.routes");

const app = express();

/**
 * ================================
 * 🌐 MIDDLEWARES GLOBAUX
 * ================================
 */
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());               // ✅ OBLIGATOIRE pour JWT en cookie
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ================================
 * 🛣️ ROUTES
 * ================================
 */
app.get('/', (req, res) => {
  res.send('✅ API PolyBuddy opérationnelle');
});

app.use('/api/auth', authRoutes);       // login, register, logout
app.use('/api/admin', adminRoutes);     // routes protégées admin
app.use("/api/profile", profileRoutes);


/**
 * ================================
 * ❌ ROUTE 404
 * ================================
 */
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

module.exports = app;
