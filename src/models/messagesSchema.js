// src/models/message.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    chatId: { type: DataTypes.INTEGER, allowNull: false },
    sender: { type: DataTypes.ENUM("user", "ai"), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
}, {
    timestamps: true,
    tableName: "messages",
});

module.exports = Message;
