const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  // Clé primaire UUID
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

  password: {
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

  role: {
      type: DataTypes.ENUM("student", "alumni", "admin"),
    allowNull: false
  },

  account_status: {
    type: DataTypes.ENUM("active", "pending", "suspended", "deleted"),
      defaultValue: "pending",
  },

  langue: {
    type: DataTypes.ENUM('fr', 'en'),
    defaultValue: 'fr'
  },
  
  addressId: {
    type: DataTypes.INTEGER,
    references: { model: "Addresses", key: "id" }
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
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
