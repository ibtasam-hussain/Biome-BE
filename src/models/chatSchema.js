// src/models/chat.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Chat = sequelize.define("Chat", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, defaultValue: "New Chat" }, // like "Chat with AI"
}, {
    timestamps: true,
    tableName: "chats",
});

module.exports = Chat;
