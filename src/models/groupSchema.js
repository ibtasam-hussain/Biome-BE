const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Group = sequelize.define(
  "Group",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: true,
    tableName: "groups",
  }
);

module.exports = Group;
