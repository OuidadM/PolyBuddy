// src/models/Friendship.js

const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

class Friendship extends Model {}

Friendship.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE"
    },

    friend_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE"
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "blocked"),
      defaultValue: "pending"
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: "Friendship",
    tableName: "friendships",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "friend_id"]
      }
    ]
  }
);

// Relations
User.hasMany(Friendship, { foreignKey: "user_id", as: "friendships_sent" });
User.hasMany(Friendship, { foreignKey: "friend_id", as: "friendships_received" });

Friendship.belongsTo(User, { foreignKey: "user_id", as: "user" });
Friendship.belongsTo(User, { foreignKey: "friend_id", as: "friend" });

module.exports = Friendship;