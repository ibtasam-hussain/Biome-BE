// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const userController = require("../controllers/usersController");

// Auth
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Password Recovery
router.post("/forget-password", userController.forgetPassword);
router.post("/set-new-password", userController.setNewPassword);

// Password Management
router.post("/reset-password", auth, userController.resetPassword);
router.post("/change-password", auth, userController.changePassword);

// Profile
router.post("/setup-profile", auth, upload.single("profilePic"), userController.setupProfile);
router.get("/get-profile", auth, userController.getProfile);

module.exports = router;
