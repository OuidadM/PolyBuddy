const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");

class UserService {
  static async login({ username, password }) {

    /** =========================
     * 1️⃣ Validation
     ========================= */
    if (!username || !password) {
      throw { status: 400, message: "Login et mot de passe requis" };
    }

    /** =========================
     * 2️⃣ Recherche utilisateur
     ========================= */
    const user = await User.scope("withPassword").findOne({
        where: { login: username.toLowerCase() },
        include: {
            model: Student,
            as: "student"
        }
        });


    if (!user) {
      throw { status: 401, message: "Login ou mot de passe incorrect" };
    }

    /** =========================
     * 3️⃣ Vérifier mot de passe
     ========================= */
    console.log("HASH :", user.passwordHash);
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw { status: 401, message: "Login ou mot de passe incorrect" };
    }

    /** =========================
     * 4️⃣ Vérifier statut compte
     ========================= */
    if (user.account_status !== "active") {
      throw {
        status: 403,
        message: "Compte non actif. Veuillez contacter l'administration."
      };
    }

    // 🎓 Étudiant non validé
    if (user.role != "admin") {
      if (user.student?.verification_status !== "verifie") {
        throw {
          status: 403,
          message: "Votre compte n'est pas encore validé."
        };
      }
    }

    /** =========================
     * 5️⃣ Générer JWT
     ========================= */
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    /** =========================
     * 6️⃣ Retour service
     ========================= */
    return {
      token,
      user: {
        id: user.id,
        login: user.login,
        prenom: user.prenom,
        nom: user.nom,
        role: user.role,
        langue: user.langue,
        avatar_url: user.avatar_url

      }
    };
  }
}



module.exports = UserService;
