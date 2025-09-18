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

