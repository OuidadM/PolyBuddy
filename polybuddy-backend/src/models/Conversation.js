// src/models/Conversation.js
const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");

class Conversation extends Model {}

Conversation.init({
  id_conv: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date_creation: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  type: {
    type: DataTypes.ENUM('direct', 'groupe'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Conversation',
  tableName: 'conversations',
  timestamps: false
});

module.exports = Conversation;