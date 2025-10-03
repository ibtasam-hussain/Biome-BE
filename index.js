require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/database");
const { User, Otp, Chat, Message } = require("./src/models/index");
const userRoutes = require("./src/routes/user.routes");
const chatRoutes = require("./src/routes/chat.routes");
const passport = require("passport");
require("./src/controllers/passport"); 
const socialRoutes = require("./src/routes/social.routes");

const app = express();

app.use(cors(
  {
    origin: "*",
    credentials: true,
  }
));
app.use(express.json());
app.use(passport.initialize());

//make static folder  
app.use("/uploads", express.static("uploads"));


// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Node + Express + MySQL is running!");
});

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/social-login", socialRoutes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected!");

    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced!");

    app.listen(process.env.PORT, () => {
      console.log(`🔥 Server running on http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
})();
