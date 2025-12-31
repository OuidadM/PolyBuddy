const bcrypt = require("bcrypt");
const { sequelize } = require("../config/db");
const User = require("../models/User");
const Student = require("../models/Student");

const SPECIALITE = require("../enums/specialiteEnum");

async function seedStudents() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion DB OK");

    const passwordHash = await bcrypt.hash("Password123!", 10);

    const studentsData = [
      {
        prenom: "Yassine",
        nom: "El Amrani",
        genre : "M",
        num_etudiant : 100000,
        nationalite: "Marocaine",
        specialite: SPECIALITE.SAGI,
        niveau: 3
      },
      {
        prenom: "Amel",
        nom: "Benali",
        genre : "F",
        num_etudiant : 100001,
        nationalite: "Algérienne",
        specialite: SPECIALITE.QIF,
        niveau: 2
      },
      {
        prenom: "Lucas",
        nom: "Martin",
        genre : "M",
        num_etudiant : 100002,
        nationalite: "Française",
        specialite: SPECIALITE.GBS,
        niveau: 4
      },
      {
        prenom: "Giulia",
        nom: "Rossi",
        genre : "F",
        num_etudiant : 100003,
        nationalite: "Italienne",
        specialite: SPECIALITE.GBS,
        niveau: 1
      },
      {
        prenom: "Yassmina",
        nom: "Madani",
        genre : "F",
        num_etudiant : 100004,
        nationalite: "Marocaine",
        specialite: SPECIALITE.QIF,
        niveau: 3
      },
      {
        prenom: "Elma",
        nom: "Renault",
        genre : "F",
        num_etudiant : 100005,
        nationalite: "Française",
        specialite: SPECIALITE.BAT,
        niveau: 2
      },
      {
        prenom: "Nicolas",
        nom: "Martiniz",
        genre : "M",
        num_etudiant : 100006,
        nationalite: "Française",
        specialite: SPECIALITE.BAT,
        niveau: 4
      },
      {
        prenom: "Angel",
        nom: "Rossi",
        genre : "M",
        num_etudiant : 100007,
        nationalite: "Italienne",
        specialite: SPECIALITE.SAGI,
        niveau: 1
      },
      {
        prenom: "Nirmine",
        nom: "Khiri",
        genre : "F",
        num_etudiant : 100008,
        nationalite: "Tunisienne",
        specialite: SPECIALITE.QIF,
        niveau: 3
      },
      {
        prenom: "Rim",
        nom: "Benali",
        genre : "F",
        num_etudiant : 100009,
        nationalite: "Algérienne",
        specialite: SPECIALITE.QIF,
        niveau: 2
      },
      {
        prenom: "Léo",
        nom: "Badas",
        genre : "M",
        num_etudiant : 100010,
        nationalite: "Française",
        specialite: SPECIALITE.BAT,
        niveau: 4
      },
      {
        prenom: "Mia",
        nom: "Rio",
        genre : "F",
        num_etudiant : 100011,
        nationalite: "Italienne",
        specialite: SPECIALITE.GBS,
        niveau: 1
      }
    ];

    for (const s of studentsData) {
      const prenomClean = normalize(s.prenom);
      const nomClean = normalize(s.nom);

      const login = `${prenomClean}.${nomClean}`;
      const emailUniv = `${login}@etud.univ-angers.fr`;

      const user = await User.create({
        login,
        passwordHash,
        prenom: s.prenom,
        nom: s.nom,
        genre:s.genre,
        nationalite: s.nationalite,
        role: "student",
        account_status: "active",
        langue: "Français"
      });

      await Student.create({
        id: user.id, // 🔗 lien direct User <-> Student
        niveau: s.niveau,
        specialite: s.specialite,
        num_etudiant:s.num_etudiant,
        mail_univ: emailUniv,
        verification_status: "verifie",
        verified_at: new Date()
      });

      console.log(`🎓 Étudiant créé : ${s.prenom} ${s.nom}`);
    }

    console.log("✅ Seed terminé avec succès");
    process.exit(0);

  } catch (error) {
    console.error("❌ Erreur seed :", error);
    process.exit(1);
  }
}

function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")                 // enlève les accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")              // enlève tous les espaces
    .replace(/[^a-z]/g, "");           // garde seulement a–z
}


seedStudents();
