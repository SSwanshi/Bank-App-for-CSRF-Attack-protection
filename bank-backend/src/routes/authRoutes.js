import express from "express";
import { login, verifyOTPController, resendOTP, logout, getMe } from "../controllers/authController.js";

const router = express.Router();

// Step 1: Login with email & password (sends OTP)
router.post("/login", login);

// Step 2: Verify OTP for 2FA
router.post("/verify-otp", verifyOTPController);

// Resend OTP
router.post("/resend-otp", resendOTP);

// Logout
router.post("/logout", logout);

// Get current user
router.get("/me", getMe);

export default router;