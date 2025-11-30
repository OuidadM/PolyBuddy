const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require('./User');

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
  tableName: 'conversations'
});

const Message = require('./Message');  

Conversation.hasMany(Message, {foreignKey: 'conversationId',as: 'messages',onDelete: 'CASCADE'});

Message.belongsTo(Conversation, {foreignKey: 'conversationId',as: 'conversation'});

module.exports = Conversation;
