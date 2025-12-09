const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ConversationParticipants = sequelize.define("ConversationParticipants", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
  }

}, {
  tableName: "conversation_participants",
  timestamps: true,  // pour createdAt/updatedAt
});

module.exports = ConversationParticipants;
