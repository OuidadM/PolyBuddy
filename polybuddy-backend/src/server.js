// server.js
const app = require('./app');
const { sequelize } = require('./config/db');

const PORT = process.env.PORT || 5000;

/**
 * ================================
 * 🚀 DÉMARRAGE DU SERVEUR
 * ================================
 */
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Base de données connectée');

    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
      console.log('📋 Routes disponibles :');
      console.log('   - POST /api/auth/login');
      console.log('   - POST /api/auth/register');
      console.log('   - POST /api/auth/logout');
      console.log('   - GET  /api/admin/students');
      console.log('   - GET  /api/admin/stats');
    });
  } catch (error) {
    console.error('❌ Erreur DB ou serveur:', error);
    process.exit(1);
  }
})();
