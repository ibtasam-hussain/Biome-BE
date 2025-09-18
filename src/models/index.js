// src/models/index.js
const User = require("./usersSchema");
const Otp = require("./otpSchema");
const Chat = require("./chatSchema");
const Message = require("./messagesSchema");

// 👉 Relations yahan define kar
User.hasMany(Otp, { foreignKey: "userId", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Chat, { foreignKey: "userId", onDelete: "CASCADE" });
Chat.belongsTo(User, { foreignKey: "userId" });

Chat.hasMany(Message, { foreignKey: "chatId", onDelete: "CASCADE" });
Message.belongsTo(Chat, { foreignKey: "chatId" });

module.exports = { User, Otp, Chat, Message };
