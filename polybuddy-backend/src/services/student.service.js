const bcrypt = require("bcrypt");
const {
  validatePassword,
  validateNomPrenom,
  validateDateNaissance
} = require("../utils/validators");

const User = require("../models/User");
const Student = require("../models/Student");
const Address = require("../models/Address");
const { normalizeAddress } = require("../utils/addressNormalizer");

class StudentService {

  static async register(data) {
    const {
      num_etudiant,
      mail_univ,
      prenom,
      nom,
      dateNaissance,
      email,
      numero,
      username,
      pass,
      niveau,
      specialite,
      centres_interet,
      justificatif,
      address,
      nationalite,
      genre,
      langue
    } = data;

    /** ===============================
     * 1️⃣ VALIDATIONS CONDITIONNELLES
     =============================== */

    // Num étudiant (OPTIONNEL)
    if (num_etudiant) {
      if (num_etudiant < 100000 || num_etudiant > 999999999) {
        throw {
          status: 400,
          message: "Le numéro étudiant doit contenir entre 6 et 9 chiffres."
        };
      }
    }

    // Mail universitaire (OPTIONNEL)
    if (mail_univ) {
      const allowedDomains = ["@etud.univ-angers.fr", "@univ-angers.fr"];
      if (!allowedDomains.some(d => mail_univ.endsWith(d))) {
        throw {
          status: 400,
          message: "Email universitaire invalide."
        };
      }
    }

    /** ===============================
     * 2️⃣ RECHERCHE STUDENT EXISTANT
     =============================== */

    let studentByNum = null;
    let studentByMail = null;

    if (num_etudiant) {
      studentByNum = await Student.findOne({
        where: { num_etudiant }
      });
    }

    if (mail_univ) {
      studentByMail = await Student.findOne({
        where: { mail_univ }
      });
    }

    // ❌ Les deux existent mais sur deux lignes différentes
    if (
      studentByNum &&
      studentByMail &&
      studentByNum.id !== studentByMail.id
    ) {
      throw {
        status: 400,
        message:
          "Le numéro étudiant et l’email universitaire n’appartiennent pas à la même personne."
      };
    }

    // 👉 Student existant (via num OU mail)
    const existingStudent = studentByNum || studentByMail;

    /** ===============================
     * 3️⃣ VALIDATIONS GLOBALES
     =============================== */

    const prenomCheck = validateNomPrenom("Prénom", prenom);
    if (!prenomCheck.valid) throw { status: 400, message: prenomCheck.message };

    const nomCheck = validateNomPrenom("Nom", nom);
    if (!nomCheck.valid) throw { status: 400, message: nomCheck.message };

    const birthCheck = validateDateNaissance(dateNaissance);
    if (!birthCheck.valid) throw { status: 400, message: birthCheck.message };

    const passCheck = validatePassword(pass, dateNaissance);
    if (!passCheck.valid) throw { status: 400, message: passCheck.message };

    if (niveau && (niveau < 1 || niveau > 5)) {
      throw {
        status: 400,
        message: "Le niveau doit être compris entre 1 et 5."
      };
    }

    const passwordValidation = validatePassword(pass, dateNaissance);
    if (!passwordValidation.valid) {
    throw { status: 400, message: passwordValidation.message };
    }

    // Vérifier unicité login/email/téléphone
    const existsUser = await User.findOne({
      where: { login: username.toLowerCase() }
    });
    if (existsUser) throw { status: 409, message: "Login déjà utilisé" };

    const existsEmail = await User.findOne({ where: { email } });
    if (existsEmail) throw { status: 409, message: "Email déjà utilisé" };

    const existsTel = await User.findOne({ where: { numero } });
    if (existsTel) throw { status: 409, message: "Numéro déjà utilisé" };


    /** ===============================
     * 4️⃣ GESTION ADRESSE (CENTRALISÉE)
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
     * 5️⃣ HASH MOT DE PASSE
     =============================== */

    const passwordHash = await bcrypt.hash(pass, 10);

    /** ===============================
     * 6️⃣ UPDATE ou CREATE
     =============================== */

    let user;
    let student;

    if (existingStudent) {
      /** ========= UPDATE ========= */

      user = await User.findByPk(existingStudent.id);

      await user.update({
        login: username.toLowerCase(),
        email,
        numero,
        prenom,
        nom,
        passwordHash,
        nationalite,
        gender: genre,
        langue,
        addressId: addressSaved?.id || null
      });

      await existingStudent.update({
        num_etudiant,
        mail_univ,
        niveau,
        specialite,
        centres_interet,
        justificatif_url: justificatif || null,
        verification_status: "verifie",
        verified_at: new Date()
      });

      student = existingStudent;

    } else {
      /** ========= CREATE ========= */

      user = await User.create({
        login: username.toLowerCase(),
        passwordHash,
        prenom,
        nom,
        email,
        numero,
        nationalite,
        gender: genre,
        langue,
        role: "student",
        addressId: addressSaved?.id || null,
        account_status: "active"
      });

      student = await Student.create({
        id: user.id,
        num_etudiant,
        mail_univ,
        niveau,
        specialite,
        centres_interet,
        justificatif_url: justificatif || null,
        verification_status: "non_verifie",
        verified_at: new Date()
      });
    }

    return { user, student };
  }
}

module.exports = StudentService;
