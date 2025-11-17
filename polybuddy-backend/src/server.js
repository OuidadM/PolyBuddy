require('dotenv').config();
const { connectDB } = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Test de la DB
    await connectDB();

    console.log("Démarrage du serveur...");

    app.listen(PORT, () => {
      console.log(`Serveur lancé sur le port ${PORT}`);
    });
  } catch (err) {
    console.error("Échec de connexion ou démarrage :", err);
    process.exit(1);
  }
})();
