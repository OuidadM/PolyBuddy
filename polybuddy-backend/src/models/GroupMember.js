const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const Student = require("./Student");
const Group = require("./Group");

class GroupMember extends Model {}

GroupMember.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },

    groupId: {
      type: DataTypes.UUID,
      references: {
        model: "groups",
        key: "id"
      },
      onDelete: "CASCADE"
    },

    studentId: {
      type: DataTypes.UUID,
      references: {
        model: "students",
        key: "id"
      },
      onDelete: "CASCADE"
    },

    membership_status: {
      type: DataTypes.ENUM("active", "pending", "banned"),
      defaultValue: "active"
    }
  },
  {
    sequelize,
    modelName: "GroupMember",
    tableName: "group_members",
    timestamps: true
  }
);

// MANY TO MANY
Group.belongsToMany(Student, { through: GroupMember, foreignKey: "groupId" });
Student.belongsToMany(Group, { through: GroupMember, foreignKey: "studentId" });

module.exports = GroupMember;
