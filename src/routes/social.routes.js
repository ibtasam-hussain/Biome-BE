const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🚀 Redirect to Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// 🚀 Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // redirect back to frontend with token
    res.redirect(`http://localhost:8080/social-login?token=${token}`);
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"], session: false })
);


router.get("/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login", session: false }),
  (req, res) => {
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.redirect(`http://localhost:8080/social-login?token=${token}`);
  }
);


module.exports = router;
