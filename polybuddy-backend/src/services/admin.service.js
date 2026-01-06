const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require("bcrypt");

class AdminService {
    static async createAdmin(req) {
        // ✅ Récupérer les données depuis req.body
        const {
            login,
            password,
            nom,
            prenom,
            email,
            nationalite,
            numero,
            langue,
            gender,
            dateNaissance,
            addressId,
            fonction
        } = req.body;

        // Validation basique
        if (!login || !password || !nom || !prenom || !email || !fonction) {
            throw {
                status: 400,
                message: "Tous les champs obligatoires doivent être remplis"
            };
        }

        // Vérifier si le login existe déjà
        const existingUser = await User.findOne({ where: { login: login.toLowerCase() } });
        if (existingUser) {
            throw {
                status: 409,
                message: "Ce login est déjà utilisé"
            };
        }

        // Vérifier si l'email existe déjà
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            throw {
                status: 409,
                message: "Cet email est déjà utilisé"
            };
        }

        // Hash du mot de passe
        const passwordHash = await bcrypt.hash(password, 10);

        // 1️⃣ Création du user
        const user = await User.create({
            login,
            passwordHash,
            nom,
            prenom,
            email,
            nationalite,
            numero,
            role: "admin",
            langue: langue || "Français",
            gender,
            dateNaissance,
            addressId: addressId || null,
            account_status: "active" // ✅ Admin actif par défaut
        });

        // 2️⃣ Création de l'admin lié au user
        const admin = await Admin.create({
            id: user.id,   // ❗ très important : même clé que le User
            fonction
        });

        return { user, admin };
    }
}

module.exports = AdminService;