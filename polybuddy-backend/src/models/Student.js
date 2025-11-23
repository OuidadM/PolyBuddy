const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const SPECIALITE = require("../enums/specialiteEnum");
const interestsEnum = require("../enums/interestsEnum");

class Student extends Model {}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE"
    },

    num_etudiant: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        isInt: { msg: "Le numéro étudiant doit être un entier." }
      }
    },

    niveau: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10
      }
    },

    specialite: {
      type: DataTypes.ENUM(...Object.values(SPECIALITE)),
      allowNull: false,
    },

    centres_interet: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
      validate: {
        isValidInterests(value) {
          const allowed = interestsEnum; // ton enum
          if (!Array.isArray(value)) {
            throw new Error("centres_interet doit être un tableau.");
          }
          for (const item of value) {
            if (!allowed.includes(item)) {
              throw new Error(`Centre d’intérêt invalide : ${item}`);
            }
          }
        }
      }
    },

    verification_status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending"
    },

    verified_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students", 
    timestamps: true,
  }
);

Student.belongsTo(User, { foreignKey: "id", as: "user", onDelete: "CASCADE" });
User.hasOne(Student, { foreignKey: "id", as: "student" });

module.exports = Student;
