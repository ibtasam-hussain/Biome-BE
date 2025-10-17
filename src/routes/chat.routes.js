const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const auth = require("../middlewares/auth");

// ---------- GROUP ROUTES ----------
router.post("/groups", auth, chatController.createGroup);
router.get("/groups", auth, chatController.getGroups);
router.get("/groups/:groupId", auth, chatController.getGroupById);
router.get("/groups/:groupId/chats", auth, chatController.getGroupChats);
router.delete("/groups/:groupId", auth, chatController.deleteGroup);


//rename routes
router.post("/groups/rename", auth, chatController.renameGroup);
router.post("/chatsrename", auth, chatController.renameChat);


// ---------- CHAT ROUTES ----------
router.post("/chats", auth, chatController.createChat);
router.get("/chats", auth, chatController.getUserChats);
router.get("/chats/:chatId/messages", auth, chatController.getChatMessages);
router.post("/chats/:chatId/messages", auth, chatController.addMessage);
router.delete("/chats/:chatId", auth, chatController.deleteChat);

module.exports = router;
