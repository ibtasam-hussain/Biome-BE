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


const allowedOrigins = [
  "http://localhost:8080",
  "https://biomelc.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());


// ✅ Middleware to parse form-data (if you use file uploads)
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//make static folder  
app.use("/uploads", express.static("uploads"));


// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Node + Express + MySQL is running!");
});

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api", chatRoutes);
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
