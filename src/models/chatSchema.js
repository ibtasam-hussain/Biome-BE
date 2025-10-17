const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Group = require("./groupSchema");

const Chat = sequelize.define(
  "Chat",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    groupId: { type: DataTypes.INTEGER, allowNull: true },
    title: { type: DataTypes.STRING, defaultValue: "New Chat" },
  },
  {
    timestamps: true,
    tableName: "chats",
  }
);

Chat.belongsTo(Group, { foreignKey: "groupId", onDelete: "CASCADE" });
Group.hasMany(Chat, { foreignKey: "groupId" });

module.exports = Chat;
