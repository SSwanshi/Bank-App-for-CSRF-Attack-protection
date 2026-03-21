import nodemailer from "nodemailer";
import { OTP_STORE } from "./userStore.js";

/* =========================
   📧 EMAIL TRANSPORTER CONFIG
========================= */

// Create transporter lazily (when it's actually needed)
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    console.log("🔍 EMAIL CONFIG DEBUG:");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Loaded" : "❌ NOT SET");
    console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "✅ Loaded" : "❌ NOT SET");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("❌ CRITICAL: Email credentials not found!");
      throw new Error("Email credentials missing: EMAIL_USER and EMAIL_PASSWORD must be set in .env");
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Test connection
    transporter.verify((error, success) => {
      if (error) {
        console.log("❌ SMTP Connection Error:", error.message);
      } else {
        console.log("✅ SMTP Connection Successful - Ready to send emails");
      }
    });
  }
  return transporter;
};

/* =========================
   🔐 GENERATE OTP
========================= */

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* =========================
   📨 SEND OTP VIA EMAIL
========================= */

export const sendOTP = async (email, otp) => {
  try {
    // Get transporter (creates it on first use, after env vars are loaded)
    const transporter = getTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 Your 2FA OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Bank App - 2FA Verification</h2>
          <p>Hello,</p>
          <p>Your One-Time Password (OTP) for login is:</p>
          <div style="background: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p><strong>⏱️ This OTP is valid for 5 minutes only.</strong></p>
          <p style="color: #666; font-size: 12px;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP:", error.message);
    return false;
  }
};

/* =========================
   ✅ STORE & VERIFY OTP
========================= */

export const storeOTP = (email, otp) => {
  // Store OTP with 5-minute expiry
  OTP_STORE[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };
  console.log(`✅ OTP stored for ${email}`);
};

export const verifyOTP = (email, providedOTP) => {
  if (!OTP_STORE[email]) {
    return { success: false, message: "No OTP request found" };
  }

  const { otp, expiresAt } = OTP_STORE[email];

  // Check if OTP expired
  if (Date.now() > expiresAt) {
    delete OTP_STORE[email];
    return { success: false, message: "OTP expired" };
  }

  // Check if OTP matches
  if (otp !== providedOTP.toString()) {
    return { success: false, message: "Invalid OTP" };
  }

  // OTP verified successfully, delete it
  delete OTP_STORE[email];
  return { success: true, message: "OTP verified successfully" };
};
