const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");

class Admin extends Model {}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE"
    },

    fonction: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    }
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "admins",
    timestamps: true
  }
);

Admin.belongsTo(User, { foreignKey: "id", as: "user", onDelete: "CASCADE" });
User.hasOne(Admin, { foreignKey: "id", as: "admin" });

module.exports = Admin;
