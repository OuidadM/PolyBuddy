// src/services/alumni.service.js
const bcrypt = require("bcrypt");
const { validatePassword, validateAnneeDiplome, validateDateNaissance, validateNomPrenom, validateJustificatifUrl } = require("../utils/validators");

const User = require("../models/User");
const Student = require("../models/Student");
const Alumni = require("../models/Alumni");
const Address = require("../models/Address");

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

    /** =============================== **/
    /**       VALIDATIONS SIMPLES      **/
    /** =============================== **/
    if (!data.num_etudiant) throw { status:400, message:"Numéro étudiant requis" };
    /*const existingNum = await Student.findOne({ where:{ num_student:data.num_student }});
    if (!existingNum) throw { status:404, message:"Numéro étudiant introuvable. Vérifiez votre diplôme." };*/

    const  anneeDiplomeValidation= validateAnneeDiplome(annee_diplome);
    if (!anneeDiplomeValidation.valid) throw { status:400, message: anneeDiplomeValidation.message };
    
    const birthCheck = validateDateNaissance(dateNaissance);
    if (!birthCheck.valid) throw { status:400, message: birthCheck.message };

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

    // Validation Nom et Prénom
    const prenomValidation = validateNomPrenom("Prénom", prenom);
    if (!prenomValidation.valid) throw { status:400, message: prenomValidation.message };

    const nomValidation = validateNomPrenom("Nom", nom);
    if (!nomValidation.valid) throw { status:400, message: nomValidation.message };

    const justificatifCheck = validateJustificatifUrl(justificatif);
    if (!justificatifCheck.valid) throw { status: 400, message: justificatifCheck.message };


    /** ===================================== **/
    /**       HASH MOT DE PASSE + USER        **/
    /** ===================================== **/
    const passwordHash = await bcrypt.hash(pass, 10);

    // Enregistrer ou récupérer l'adresse normalisée
    let addressSaved = null;

    if (address) {
    const [addr] = await Address.findOrCreate({
        where: { normalized: normalizeAddress(address) },
        defaults: { ...address } 
    });

    addressSaved = addr;
    }

    // Création user 
    const user = await User.create({
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
    account_status: "pending"
    });


    /** =============================== **/
    /**         CREATE STUDENT          **/
    /** =============================== **/
    const student = await Student.create({
    id: user.id,
    num_student: data.num_etudiant,
    specialite,
    centres_interet,
    justificatif_url: justificatif || null,
    verification_status: "en_cours",
    verified_at: null,
    });


    /** =============================== **/
    /**          CREATE ALUMNI          **/
    /** =============================== **/

    const alumni = await Alumni.create({
    id: student.id,
    annee_diplome,
    position,
    entreprise,
    profile_verified: false
    });

    //await mailService.sendAlumniPendingEmail(alumni);

    return { user, student, alumni };
  }
}

module.exports = AlumniService;
