const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const Etudiant = require('./Student');   

class Invitation extends Model {}

Invitation.init(
  {
    id_invitation: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    expediteurId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'etudiants',   
        key: 'id'
      },
      onDelete: 'CASCADE'
    },

    destinataireId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'etudiants',   
        key: 'id'
      },
      onDelete: 'CASCADE'
    },

    date_envoi: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    etat: {
      type: DataTypes.ENUM('en_attente', 'acceptee', 'refusee'),
      defaultValue: 'en_attente'
    }
  },
  {
    sequelize,
    modelName: 'Invitation',
    tableName: 'invitations',
    timestamps: true,

    validate: {
      noSelfInvitation() {
        if (this.expediteurId === this.destinataireId) {
          throw new Error("Un étudiant ne peut pas s’envoyer une invitation à lui-même");
        }
      }
    }
  }
);

Invitation.belongsTo(Etudiant, {foreignKey: 'expediteurId',as: 'expediteur'});

Invitation.belongsTo(Etudiant, {foreignKey: 'destinataireId',as: 'destinataire'});

Etudiant.hasMany(Invitation, {foreignKey: 'expediteurId',as: 'invitationsEnvoyees'});

Etudiant.hasMany(Invitation, {foreignKey: 'destinataireId',as: 'invitationsRecues'});

module.exports = Invitation;
