// src/models/index.js
const User = require("./User");
const Student = require("./Student");
const Alumni = require("./Alumni");
const Friendship = require("./Friendship");
const Invitation = require("./Invitation");
const Conversation = require("./Conversation");
const Message = require("./Message");
const Group = require("./Group");
const GroupMember = require("./GroupMember");

// ✅ Définir les associations pour Group APRÈS les imports
Group.belongsTo(Alumni, { foreignKey: "adminId", as: "admin" });
Alumni.hasMany(Group, { foreignKey: "adminId", as: "groupsCreated" });

Group.belongsTo(Conversation, { foreignKey: "conversationId", as: "conversation" });

module.exports = {
  User,
  Student,
  Alumni,
  Friendship,
  Invitation,
  Conversation,
  Message,
  Group,
  GroupMember
};

// Ajouter à la fin de models/index.js après tous les imports

// Relations Conversation <-> Student
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

// Relations Conversation <-> Group
Conversation.hasOne(Group, { 
  foreignKey: "conversationId",
  as: "groupDetails",
  onDelete: "CASCADE"
});

// Relations Conversation <-> Message
Conversation.hasMany(Message, {
  foreignKey: 'conversationId',
  as: 'messages',
  onDelete: 'CASCADE'
});

Message.belongsTo(Conversation, {
  foreignKey: 'conversationId',
  as: 'conversation'
});
