const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const Alumni = require("./Alumni");
const Conversation = require("./Conversation"); 

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

    adminId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "alumni",
        key: "id"
      },
      onDelete: "CASCADE"
    },

    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "conversations",  
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

// Relations
Group.belongsTo(Alumni, { foreignKey: "adminId", as: "admin" });


Group.belongsTo(Conversation, { foreignKey: "id_conv", as: "conversation" });

module.exports = Group;
 