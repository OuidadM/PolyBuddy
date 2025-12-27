const { DataTypes, Model } = require('sequelize');
const {sequelize} = require('../config/db');
const User = require("./User");
const SPECIALITE = require("../enums/specialiteEnum");
const interestsEnum = require("../enums/interestsEnum");

class Student extends Model {}

Student.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE"
  },
  num_student: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true,
    validate: {
      isInt: { msg: 'Le numéro étudiant doit être un entier' },
      min: { args: [100000], msg: 'Le numéro étudiant doit contenir au moins 6 chiffres' },
      max: { args: [999999999], msg: 'Le numéro étudiant ne peut pas dépasser 9 chiffres' }
    }
  },

  niveau: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: { args: [1], msg: 'Le niveau minimum est 1' },
      max: { args: [5], msg: 'Le niveau maximum est 5' },
      isInt: { msg: 'Le niveau doit être un nombre entier' }
    }
  },

  specialite: {
    type: DataTypes.ENUM(...Object.values(SPECIALITE)),
    allowNull: false,
  },

 mail_univ: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: { msg: "Email invalide" },
      endsWithCorrectDomain(value) {
        // ✅ autoriser null / undefined
        if (!value) return;

        const allowedDomains = ["@etud.univ-angers.fr", "@univ-angers.fr"];
        if (!allowedDomains.some(domain => value.endsWith(domain))) {
          throw new Error(
            "L'email universitaire doit se terminer par @etud.univ-angers.fr ou @univ-angers.fr"
          );
        }
      }
    }
  },

  centres_interet: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
      validate: {
        isValidInterests(value) {
        const allowed = interestsEnum;
          if (!Array.isArray(value)) {
              throw new Error("centres_interet doit être un tableau.");
            }
            for (const item of value) {
              if (!allowed.includes(item)) {
                throw new Error(`Centre d'intérêt invalide : ${item}`);
              }
            }
          }
        }
      },

  justificatif_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: "Le justificatif doit être une URL valide" }
    }
  },
  
  verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  verification_status: {
    type: DataTypes.ENUM('non_verifie', 'en_cours', 'verifie', 'rejete'),
    defaultValue: 'non_verifie',
  }

}, {
    sequelize,
    modelName: "Student",
    tableName: "students", 
    timestamps: true,
  }
);

Student.belongsTo(User, { foreignKey: "id", as: "user", onDelete: "CASCADE" });
User.hasOne(Student, { foreignKey: "id", as: "student" });

module.exports = Student;
