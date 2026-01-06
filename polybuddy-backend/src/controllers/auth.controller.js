// src/controllers/authController.js
const StudentService = require("../services/student.service");
const AlumniService = require("../services/alumni.service");
const UserService = require("../services/user.service");
const AdminService = require("../services/admin.service");

exports.register = async (req, res) => {
  try {
    /* ============================
       1️⃣ Parser le JSON du FormData
       ============================ */
    const data = req.body.data
      ? JSON.parse(req.body.data)
      : req.body;

    const file = req.file; // fichier Cloudinary (si présent)

    const {
      prenom,
      nom,
      dateNaissance,
      username,
      specialite,
      role,
      niveau,
      num_etudiant,
      nationalite,
      genre,
      langue,
      centres_interet,
      numero,
      email,
      address,
      mail_univ,
      pass,
      annee_diplome,
      position,
      entreprise,
      justificatif
    } = data;

    /* ============================
       2️⃣ ALUMNI
       ============================ */
    if (role === "alumni") {
      let justificatifFinal = justificatif || null;

      // priorité au fichier uploadé
      if (file) {
        justificatifFinal = file.path; // URL Cloudinary
      }

      const alumniData = {
        prenom,
        nom,
        dateNaissance,
        username,
        specialite,
        num_etudiant,
        nationalite,
        genre,
        langue,
        centres_interet,
        numero,
        email,
        address,
        pass,
        annee_diplome,
        position,
        entreprise,
        justificatif: justificatifFinal
      };

      const alumni = await AlumniService.registerAlumni(alumniData);
      return res.status(201).json({
        success: true,
        status: "pending",
        message: "Votre inscription a bien été prise en compte. Vous pourrez vous connecter après validation par un administrateur."
      });
    }

    /* ============================
       3️⃣ STUDENT
       ============================ */
    const studentData = {
      prenom,
      nom,
      dateNaissance,
      username,
      specialite,
      niveau,
      num_etudiant,
      nationalite,
      genre,
      langue,
      centres_interet,
      numero,
      email,
      address,
      mail_univ,
      pass,
      justificatif: file ? file.path : justificatif // optionnel
    };
    console.log("Controller's log")
    const student = await StudentService.register(studentData);
    
    return res.status(201).json({
      success: true,
      status: student.student.get("verification_status") === "verifie" ? "active" : "pending",
      message:
        student.student.get("verification_status") === "verifie"
          ? "Votre inscription a été validée avec succès. Vous pouvez vous connecter."
          : "Votre inscription a bien été prise en compte. Vous pourrez vous connecter après validation par un administrateur."
    });



  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({
      error: err.message || "Erreur interne du serveur"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Appel service
    const result = await UserService.login({ username, password });

    /** =========================
     * Cookie HttpOnly
     ========================= */
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      user: result.user
    });

  } catch (err) {
    console.error("❌ Erreur login :", err);

    return res.status(err.status || 500).json({
      error: err.message || "Erreur interne du serveur"
    });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    // Appel au service
    console.log("REQ BODY =", req.body);

    const { user, admin } = await AdminService.createAdmin(req);
    
    return res.status(201).json({
      success: true,
      message: "Admin créé avec succès",
      data: {
        id: user.id,
        login: user.login,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        fonction: admin.fonction
      }
    });
  } catch (error) {
    console.error("❌ Erreur création admin:", error);
    
    return res.status(error.status || 500).json({
      success: false,
      error: error.message || "Erreur lors de la création de l'admin"
    });
  }
};


