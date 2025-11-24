const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const Alumni = require("./Alumni");

class Group extends Model {}

Group.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    date_creation: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    actif: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    // l'admin du groupe = un alumni
    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "alumni",
        key: "id"
      },
      onDelete: "CASCADE"
    }
  },
  {
    sequelize,
    modelName: "Group",
    tableName: "groups",
    timestamps: true
  }
);

Group.belongsTo(Alumni, { foreignKey: "adminId", as: "admin" });

module.exports = Group;
