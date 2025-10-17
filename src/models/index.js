const User = require("./usersSchema");
const Otp = require("./otpSchema");
const Chat = require("./chatSchema");
const Message = require("./messagesSchema");
const Group = require("./groupSchema"); // ✅ new model

// 👉 Relations defined here

// ----------------------
// User ↔ Otp
// ----------------------
User.hasMany(Otp, { foreignKey: "userId", onDelete: "CASCADE" });
Otp.belongsTo(User, { foreignKey: "userId" });

// ----------------------
// User ↔ Chat
// ----------------------
User.hasMany(Chat, { foreignKey: "userId", onDelete: "CASCADE" });
Chat.belongsTo(User, { foreignKey: "userId" });

// ----------------------
// Chat ↔ Message
// ----------------------
Chat.hasMany(Message, { foreignKey: "chatId", onDelete: "CASCADE" });
Message.belongsTo(Chat, { foreignKey: "chatId" });

// ----------------------
// Group (Agent) ↔ Chat
// ----------------------
// ✅ Each Group (Agent) can have multiple Chats
Group.hasMany(Chat, { foreignKey: "groupId", onDelete: "CASCADE" });

// ✅ Each Chat belongs to one Group (Agent)
Chat.belongsTo(Group, { foreignKey: "groupId" });

module.exports = { User, Otp, Chat, Message, Group };
