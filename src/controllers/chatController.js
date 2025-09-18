// src/controllers/chat.controller.js
const Chat = require("../models/chatSchema");
const Message = require("../models/messagesSchema");

// Start a new chat
exports.createChat = async (req, res) => {
    try {
        const chat = await Chat.create({ userId: req.user.id, title: req.body.title || "New Chat" });
        res.json({ message: "Chat created", chat });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a message (user or AI)
exports.addMessage = async (req, res) => {
    try {
        const { chatId, sender, content } = req.body;
        const chat = await Chat.findByPk(chatId);

        if (!chat) return res.status(404).json({ message: "Chat not found" });

        const message = await Message.create({ chatId, sender, content });
        res.json({ message: "Message added", data: message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all chats of logged in user
exports.getUserChats = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            where: { userId: req.user.id },
            order: [["updatedAt", "DESC"]],
        });
        res.json({ chats });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get messages of a chat
exports.getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await Message.findAll({
            where: { chatId },
            order: [["createdAt", "ASC"]],
        });
        res.json({ messages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
