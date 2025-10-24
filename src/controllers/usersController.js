// src/controllers/user.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/usersSchema");
const Otp = require("../models/otpSchema");
const crypto = require("crypto");

// 🔹 Signup
exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const exist = await User.findOne({ where: { email } });
        if (exist) return res.status(400).json({ message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, password: hashed });

        res.json({ message: "Signup successful", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 Forget Password (send OTP)
exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otpCode = crypto.randomInt(1000, 9999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        await Otp.create({ userId: user.id, otp: otpCode, expiresAt });
        console.log("OTP =>", otpCode); // send via email / sms in real project

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 Set New Password (via OTP)
exports.setNewPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const record = await Otp.findOne({
            where: { userId: user.id, otp, verified: false },
        });

        if (!record) return res.status(400).json({ message: "Invalid OTP" });
        if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

        record.verified = true;
        await record.save();

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 Reset Password (when logged in)
exports.resetPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid) return res.status(400).json({ message: "Old password incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 Change Password (force update by user)
exports.changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 Setup Profile (with multer)
exports.setupProfile = async (req, res) => {
    try {
        console.log(req.file);
        const userId = req.user.id || req.user.user?.id;
        const user = await User.findByPk(userId);
        console.log(user);
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        if (req.file) user.profile = req.file.path;

        await user.save();
        res.json({ message: "Profile updated", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// 🔹 Get Profile
exports.getProfile = async (req, res) => {
  try {

    const userId = req.user.user?.id || req.user.id;

    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};






//admin routes


//admin login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check admin/superadmin
    if (user.role !== "admin" && user.role !== "superadmin")
      return res.status(400).json({ message: "You are not admin" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//create user
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, role, password } = req.body;
        const user = await User.create({ firstName, lastName, email, role, password });
        res.json({ message: "User created successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

//edit user
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, password } = req.body;
console.log(req.body);
console.log("🔍 Params ID:", id);

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update basic fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.role = role || user.role;

    // 🔐 Update password only if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//delete user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        await user.destroy();
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


//get all users with pagination
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = await User.findAll({
      offset,
      limit,
      order: [["id", "DESC"]], // optional: to keep consistent order
    });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



//get All admins and super admins with pagination
exports.getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // ✅ Fetch users where role is either 'admin' OR 'superadmin'
    const users = await User.findAll({
      where: {
        role: ["admin", "superadmin"], // Sequelize IN operator
      },
      offset,
      limit,
      order: [["id", "DESC"]],
    });

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



