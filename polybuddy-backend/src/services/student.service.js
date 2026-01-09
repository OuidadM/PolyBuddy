const bcrypt = require("bcrypt");
const {
  validatePassword,
  validateNomPrenom,
  validateDateNaissance
} = require("../utils/validators");

const User = require("../models/User");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");
const Address = require("../models/Address");
const { normalizeAddress } = require("../utils/addressNormalizer");

const mailService = require("./mail.service");

class StudentService {

  /**
   * Récupérer la liste des étudiants et alumni par statut de vérification
   * @param {string} verificationStatus - 'non_verifie', 'en_cours', 'verifie', 'rejete'
   * @returns {Array} Liste des students avec leurs infos user et alumni (si applicable)
   */
  static async getListStudents(verificationStatus) {
    try {
      // Validation du statut
      const validStatuses = ['non_verifie', 'en_cours', 'verifie', 'rejete'];
      if (!validStatuses.includes(verificationStatus)) {
        throw {
          status: 400,
          message: `Statut invalide. Valeurs autorisées : ${validStatuses.join(', ')}`
        };
      }

      // Récupérer tous les students avec le statut demandé
      const students = await Student.findAll({
        where: {
          verification_status: verificationStatus
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: [
              'id', 
              'login', 
              'nom', 
              'prenom', 
              'email', 
              'numero', 
              'nationalite', 
              'gender', 
              'langue',
              'dateNaissance',
              'account_status',
              'createdAt'
            ],
            include: [
              {
                model: Address,
                attributes: ['street', 'city', 'postalCode']
              }
            ]
          },
          {
            model: Alumni,
            as: "alumni",
            required: false, // LEFT JOIN (inclure même si pas alumni)
            attributes: [
              'annee_diplome', 
              'position', 
              'entreprise', 
              'profile_verified',
              'createdAt'
            ]
          }
        ],
        order: [
          ['createdAt', 'DESC'] // Les plus récents en premier
        ]
      });

      // Formater les résultats
      const formattedStudents = students.map(student => {
        const isAlumni = !!student.alumni;
        
        return {
          // Infos Student
          id: student.id,
          num_etudiant: student.num_etudiant,
          mail_univ: student.mail_univ,
          niveau: student.niveau,
          specialite: student.specialite,
          centres_interet: student.centres_interet,
          justificatif_url: student.justificatif_url,
          verification_status: student.verification_status,
          verified_at: student.verified_at,
          type: isAlumni ? "Alumni" : "Étudiant", // ✅ Type pour le frontend
          
          // Infos User
          user: {
            login: student.user.login,
            nom: student.user.nom,
            prenom: student.user.prenom,
            email: student.user.email,
            numero: student.user.numero,
            nationalite: student.user.nationalite,
            gender: student.user.gender,
            langue: student.user.langue,
            dateNaissance: student.user.dateNaissance,
            account_status: student.user.account_status,
            address: student.user.Address || null
          },
          
          // Infos Alumni (si applicable)
          alumni: isAlumni ? {
            annee_diplome: student.alumni.annee_diplome,
            position: student.alumni.position,
            entreprise: student.alumni.entreprise,
            profile_verified: student.alumni.profile_verified
          } : null,
          
          // Dates
          createdAt: student.createdAt,
          updatedAt: student.updatedAt
        };
      });

      return formattedStudents;

    } catch (error) {
      console.error("❌ Erreur getListStudents:", error);
      throw error;
    }
  }

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
      studentByNum = await Student.findOne({ where: { num_etudiant } });
    }

    if (mail_univ) {
      studentByMail = await Student.findOne({ where: { mail_univ } });
    }

    // ❌ Num et mail existent mais pas la même personne
    if (
      studentByNum &&
      studentByMail &&
      studentByNum.id !== studentByMail.id
    ) {
      throw {
        status: 400,
        message:
          "Le numéro étudiant et l'email universitaire n'appartiennent pas à la même personne."
      };
    }

    // ❌ Mail existe mais pas de numéro correspondant
    if (!studentByNum && studentByMail) {
      throw {
        status: 400,
        message:
          "Cet email universitaire est déjà utilisé. Veuillez vous connecter."
      };
    }

    // ✅ Étudiant existant (même personne)
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
        dateNaissance,
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
        dateNaissance,
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
        verification_status: "en_cours",
        verified_at: new Date()
      });
    }

    await mailService.sendStudentPendingEmail(user);
    return { user, student };
  }
}

module.exports = StudentService;