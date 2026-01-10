const app = require("./app");
const { sequelize } = require("./config/db");

// ⚠️ importe les modèles
require("./models");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connectée");

    await sequelize.sync({ alter: true }); // ⬅️ CRÉE friendships
    console.log("✅ Tables synchronisées");

    app.listen(PORT, () =>
      console.log(`🚀 Serveur lancé sur le port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Erreur DB :", err);
  }
})();
