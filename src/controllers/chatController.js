const axios = require("axios");
const Chat = require("../models/chatSchema");
const Message = require("../models/messagesSchema");

// Start a new chat
exports.createChat = async (req, res) => {
  try {
    const chat = await Chat.create({
      userId: req.user.id,
      title: req.body.title || "New Chat"
    });
    res.json({ message: "Chat created", chat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a message (user → AI → save both)
exports.addMessage = async (req, res) => {
  try {
    const { chatId, sender, content } = req.body;

    const chat = await Chat.findByPk(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // If first user message, set chat title from the content
    if (sender === "user" && chat.title === "New Chat") {
      await chat.update({ title: content.substring(0, 50) });
    }

    // 1) Save user message
    const userMsg = await Message.create({ chatId, sender, content });

    // 2) Prepare short history
    const lastMessages = await Message.findAll({
      where: { chatId },
      order: [["createdAt", "DESC"]],
      limit: 5,
    });
    const history = lastMessages
      .map((m) => `${m.sender}: ${m.content}`)
      .reverse()
      .join("\n");

    // 3) Call AI
    const aiRes = await axios.post("http://147.79.75.202:8001/query", {
      query: content,
      chat_history: history,
    });


    const data = aiRes?.data || {};
    const aiText = data.ans || "No reply";

    // 4) Save AI message with full meta
    // REQUIRES: Message model to have a JSON/JSONB column named `meta`
    const aiMsg = await Message.create({
      chatId,
      sender: "ai",
      content: aiText,
      meta: {
        source: data.source ?? null,
        where_to_find: data.where_to_find ?? null,
        tools: Array.isArray(data.tools) ? data.tools : (data.tools ? [data.tools] : []),
        timestamps: data.timestamps ?? null,
        query: data.query ?? content,
        success: typeof data.success === "boolean" ? data.success : true,
        error: data.error ?? null,
      },
    });

    // 5) Touch chat updatedAt
    await chat.update({ updatedAt: new Date() });

    res.json({
      message: "User + AI messages stored",
      user: userMsg,
      ai: aiMsg,
    });
  } catch (err) {
    console.error("❌ Chat Error:", err);
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

//delete chat by id
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findByPk(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    await chat.destroy();
    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};