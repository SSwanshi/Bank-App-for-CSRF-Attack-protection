import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import bankRoutes from "./routes/bankRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

/* =========================
   🔧 BASIC MIDDLEWARE
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   🌐 CORS CONFIG
========================= */

app.use(
  cors({
    origin: "http://localhost:3000" || "https://bank-app-for-csrf-attack-protection.vercel.app/",
    credentials: true, // 🔥 MUST
  })
);

/* =========================
   🔐 GLOBAL SECURITY MODE
========================= */

export let SECURITY_MODE = "vulnerable"; // default

export const setMode = (newMode) => {
  SECURITY_MODE = newMode;
  console.log("🔁 SECURITY MODE:", SECURITY_MODE);
};

/* =========================
   🍪 SESSION CONFIG
========================= */

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true, // 👉 true in production (HTTPS)
      sameSite: "none", // default safe (overridden dynamically)
    },
  })
);

/* =========================
   📡 ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("🏦 Bank backend running");
});

app.use("/auth", authRoutes);
app.use("/bank", bankRoutes);
app.use("/admin", adminRoutes);

/* =========================
   ❌ ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

/* =========================
   🚀 START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});