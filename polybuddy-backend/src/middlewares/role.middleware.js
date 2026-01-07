/**
 * Middleware de gestion des rôles
 * ⚠️ req.user DOIT être injecté avant (middleware authenticate)
 */

module.exports.authorizeAdmin = (req, res, next) => {
  // 1️⃣ Sécurité supplémentaire (au cas où authenticate n’a pas été appelé)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Non authentifié"
    });
  }

  // 2️⃣ Vérification du rôle admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Accès admin requis"
    });
  }

  // 3️⃣ OK → accès autorisé
  next();
};

/**
 * 🔓 Autorisation générique par rôles
 * 
 * Exemple :
 * authorizeRoles('admin', 'moderator')
 */
module.exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Non authentifié"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé"
      });
    }

    next();
  };
};
