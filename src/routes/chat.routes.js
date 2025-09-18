// src/routes/chat.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const chatController = require("../controllers/chatController");

router.post("/create", auth, chatController.createChat);
router.post("/message", auth, chatController.addMessage);
router.get("/recent", auth, chatController.getUserChats);
router.get("/:chatId/messages", auth, chatController.getChatMessages);

module.exports = router;
