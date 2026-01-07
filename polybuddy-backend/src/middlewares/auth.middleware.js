const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.authenticate = async (req, res, next) => {
  try {
    // 1️⃣ Récupérer le token (cookie OU header Authorization)
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Non authentifié - token manquant"
      });
    }

    // 2️⃣ Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Récupérer l'utilisateur
    const user = await User.findByPk(decoded.id, {
      attributes: [
        'id',
        'login',
        'nom',
        'prenom',
        'email',
        'role',
        'account_status'
      ]
    });
    console.log("user : ",user)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable"
      });
    }

    if (user.account_status !== 'active') {
      return res.status(403).json({
        success: false,
        message: "Compte désactivé"
      });
    }

    // 4️⃣ Injecter l'utilisateur dans la requête
    req.user = user;

    next();
  } catch (error) {
    console.error("❌ Erreur auth middleware:", error.message);

    return res.status(401).json({
      success: false,
      message: "Token invalide ou expiré"
    });
  }
};
