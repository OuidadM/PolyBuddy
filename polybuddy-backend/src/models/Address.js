// src/models/Address.js
const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../config/db");
const { normalizeAddress } = require("../utils/addressNormalizer");

class Address extends Model {}

Address.init(
  {
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complement: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    normalized: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "addresses", 
    timestamps: true,
    hooks: {
      beforeValidate(address) {
        address.normalized = normalizeAddress(address);
      },
    },
  }
);

module.exports = Address;
