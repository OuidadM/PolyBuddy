const { DataTypes, Model } = require("sequelize"); 
const { sequelize } = require("../config/db");
const Address = require("./Address");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue("login", value?.trim().toLowerCase());
      },
      validate: {
        notEmpty: { msg: "Le login ne peut pas être vide." },
        len: [3, 50]
      }
    },

    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [2, 50], msg: 'Le nom doit contenir entre 2 et 50 caractères' },
        is: { args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/i, msg: 'Le nom contient des caractères invalides' }
      }
    },

    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: { args: [2, 50], msg: 'Le prénom doit contenir entre 2 et 50 caractères' },
        is: { args: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/i, msg: 'Le prénom contient des caractères invalides' }
      }
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: { msg: 'Email invalide' } }
    },
    nationalite: {
      type: DataTypes.STRING,
      validate: {
        len: { args: [2, 80], msg: "La nationalité doit être entre 2 et 80 caractères." }
      }
    },

    numero: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        is: {
          args: /^[0-9+ ]+$/,
          msg: "Le numéro doit contenir uniquement des chiffres ou +",
        },
      },
    },

    role: {
      type: DataTypes.ENUM("student", "alumni", "admin"),
      allowNull: false
    },

    account_status: {
      type: DataTypes.ENUM("active", "pending", "suspended", "deleted"),
        defaultValue: "pending",
    },

    langue: {
      type: DataTypes.ENUM("Français", "Anglais", "Arabe", "Espagnol",
    "Allemand", "Italien", "Chinois", "Autre"),
      defaultValue: "Français"
    },
    gender: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        validate: {
          isIn: {
            args: [["M", "F", "A"]],
            msg: "Le genre doit être 'M', 'F' ou 'A'."
          }
        }
      },
    
    addressId: {
      type: DataTypes.INTEGER,
      references: { model: "addresses", key: "id" }
      },

    bio: DataTypes.TEXT,
  
    dateNaissance: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: 'La date de naissance doit être une date valide' },
        isBefore: {
          args: [new Date().toISOString().split('T')[0]], // la date doit être dans le passé
          msg: 'La date de naissance ne peut pas être dans le futur'
        }
      }
    }
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users", 
    timestamps: true,
    defaultScope: { attributes: { exclude: ["passwordHash"] } },
  });


User.belongsTo(Address, { foreignKey: "addressId" });
Address.hasMany(User, { foreignKey: "addressId" });

module.exports = User;
