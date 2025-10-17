const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Chat = require("./chatSchema");

const Message = sequelize.define(
  "Message",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chatId: { type: DataTypes.INTEGER, allowNull: false },
    sender: { type: DataTypes.ENUM("user", "ai"), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    meta: { type: DataTypes.JSON, allowNull: true },
  },
  {
    timestamps: true,
    tableName: "messages",
  }
);

Message.belongsTo(Chat, { foreignKey: "chatId", onDelete: "CASCADE" });
Chat.hasMany(Message, { foreignKey: "chatId" });

module.exports = Message;
