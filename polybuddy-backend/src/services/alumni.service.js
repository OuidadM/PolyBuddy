// src/services/alumni.service.js
const bcrypt = require("bcrypt");
const {
  validatePassword,
  validateAnneeDiplome,
  validateDateNaissance,
  validateNomPrenom,
  validateJustificatifUrl
} = require("../utils/validators");

const User = require("../models/User");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");
const Address = require("../models/Address");
const { normalizeAddress } = require("../utils/addressNormalizer");

const mailService = require("./mail.service");

class AlumniService {

  static async registerAlumni(data) {
    const {
      prenom,
      nom,
      dateNaissance,
      username,
      nationalite,
      genre,
      langue,
      centres_interet,
      num_etudiant,
      email,
      numero,
      address,
      pass,
      annee_diplome,
      position,
      entreprise,
      justificatif,
      specialite
    } = data;

    /** ===============================
     * 1️⃣ VALIDATIONS DE BASE
     =============================== */

    if (!num_etudiant) {
      throw { status: 400, message: "Numéro étudiant requis" };
    }

    const student = await Student.findOne({
      where: { num_etudiant },
      include: [{ model: User, as: "user" }]
    });

    if (!student) {
      throw {
        status: 404,
        message: "Numéro étudiant introuvable. Vérifiez votre diplôme."
      };
    }

    const user = student.user;

    /** ===============================
     * 2️⃣ VALIDATIONS MÉTIER
     =============================== */

    const anneeCheck = validateAnneeDiplome(annee_diplome);
    if (!anneeCheck.valid) {
      throw { status: 400, message: anneeCheck.message };
    }

    const birthCheck = validateDateNaissance(dateNaissance);
    if (!birthCheck.valid) {
      throw { status: 400, message: birthCheck.message };
    }

    const passwordCheck = validatePassword(pass, dateNaissance);
    if (!passwordCheck.valid) {
      throw { status: 400, message: passwordCheck.message };
    }

    const prenomCheck = validateNomPrenom("Prénom", prenom);
    if (!prenomCheck.valid) {
      throw { status: 400, message: prenomCheck.message };
    }

    const nomCheck = validateNomPrenom("Nom", nom);
    if (!nomCheck.valid) {
      throw { status: 400, message: nomCheck.message };
    }

    const justificatifCheck = validateJustificatifUrl(justificatif);
    if (!justificatifCheck.valid) {
      throw { status: 400, message: justificatifCheck.message };
    }

    /** ===============================
     * 3️⃣ UNICITÉ (hors utilisateur courant)
     =============================== */

    const existsLogin = await User.findOne({
      where: { login: username.toLowerCase() }
    });
    if (existsLogin && existsLogin.id !== user.id) {
      throw { status: 409, message: "Login déjà utilisé" };
    }

    const existsEmail = await User.findOne({ where: { email } });
    if (existsEmail && existsEmail.id !== user.id) {
      throw { status: 409, message: "Email déjà utilisé" };
    }

    const existsTel = await User.findOne({ where: { numero } });
    if (existsTel && existsTel.id !== user.id) {
      throw { status: 409, message: "Numéro déjà utilisé" };
    }

    /** ===============================
     * 4️⃣ ADRESSE
     =============================== */

    let addressSaved = null;

    if (address) {
      const [addr] = await Address.findOrCreate({
        where: { normalized: normalizeAddress(address) },
        defaults: { ...address }
      });
      addressSaved = addr;
    }

    /** ===============================
     * 5️⃣ UPDATE USER
     =============================== */

    const passwordHash = await bcrypt.hash(pass, 10);

    await user.update({
      login: username.toLowerCase(),
      passwordHash,
      prenom,
      nom,
      email,
      numero,
      nationalite,
      gender: genre,
      langue,
      role: "alumni",
      addressId: addressSaved?.id || null,
      account_status: "active"
    });

    /** ===============================
     * 6️⃣ UPDATE STUDENT
     =============================== */

    await student.update({
      specialite,
      centres_interet,
      justificatif_url: justificatif || student.justificatif_url,
      verification_status: "en_cours",
      verified_at: null
    });

    /** ===============================
     * 7️⃣ CREATE ALUMNI
     =============================== */

    const alumni = await Alumni.create({
      id: student.id,
      annee_diplome,
      position,
      entreprise,
      profile_verified: false
    });

    /** ===============================
     * 8️⃣ EMAIL
     =============================== */

    await mailService.sendStudentPendingEmail(user);

    return { user, student, alumni };
  }
}

module.exports = AlumniService;
