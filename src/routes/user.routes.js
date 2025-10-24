// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const auth = require("../middlewares/auth");
const userController = require("../controllers/usersController");
const queryController = require("../controllers/unansQueriesController");
const isAdmin = require("../utils/isAdmin");

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



//admin routes
router.post("/admin-login", userController.adminLogin);


router.get("/all-users", auth, isAdmin,  userController.getAllUsers);
router.get("/all-admins", auth, isAdmin, userController.getAllAdmins);

router.put("/update-user/:id", auth, isAdmin, userController.editUser);
router.delete("/delete-user/:id", auth, isAdmin, userController.deleteUser);
router.post("/create", auth, isAdmin, userController.createUser);


//unans queries
router.get("/all-queries", auth, isAdmin, queryController.getAllUnansweredQueries);
router.delete("/markAsClosed/:id", auth, isAdmin, queryController.markAsClosed);
// 
module.exports = router;
