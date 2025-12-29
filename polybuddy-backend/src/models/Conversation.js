const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const Student = require('./Student');
const Group = require('./Group');

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

Conversation.belongsToMany(Student, { 
  through: "ConversationParticipants",
  as: "participants",
  foreignKey: "conversationId"
});

Student.belongsToMany(Conversation, { 
  through: "ConversationParticipants",
  as: "conversations",
  foreignKey: "studentId"
});


Conversation.hasOne(Group, { 
  foreignKey: "conversationId",
  as: "groupDetails",
  onDelete: "CASCADE"
});


const Message = require('./Message');  

Conversation.hasMany(Message, {foreignKey: 'conversationId',as: 'messages',onDelete: 'CASCADE'});

Message.belongsTo(Conversation, {foreignKey: 'conversationId',as: 'conversation'});

module.exports = Conversation;