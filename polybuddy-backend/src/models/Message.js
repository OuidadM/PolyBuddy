const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');
const Student = require('./Student');   

class Message extends Model {}

Message.init({
  id_message: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'conversations', key: 'id_conv' },
    onDelete: 'CASCADE'
  },
  expediteurId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'students', key: 'id' }, 
    onDelete: 'CASCADE'
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  etat: {
    type: DataTypes.ENUM('envoye', 'lu'),
    defaultValue: 'envoye'
  },
  date_envoi: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Message',
  tableName: 'messages'
});

// ================= Relations =================

Message.belongsTo(Student, { foreignKey: 'expediteurId', as: 'expediteur' });
Student.hasMany(Message, { foreignKey: 'expediteurId', as: 'messagesEnvoyes' });

module.exports = Message;
