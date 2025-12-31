const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const Student = require("./Student");

class Alumni extends Model {}

Alumni.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: "students", 
        key: "id"
      },
      onDelete: "CASCADE"
    },

    annee_diplome: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1980,
        max: new Date().getFullYear()
      }
    },


    position: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 100]
      }
    },

    entreprise: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 150]
      }
    },

    profile_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: "Alumni",
    tableName: "alumni",
    timestamps: true
  }
);


Alumni.belongsTo(Student, { foreignKey: "id", as: "student", onDelete: "CASCADE" });
Student.hasOne(Alumni, { foreignKey: "id", as: "alumni" });

module.exports = Alumni;
