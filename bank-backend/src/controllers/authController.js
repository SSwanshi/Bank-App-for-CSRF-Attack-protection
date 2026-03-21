import { generateCSRFToken } from "../utils/generateToken.js";
import { SECURITY_MODE } from "../server.js";
import { USERS } from "../utils/userStore.js";
import { generateOTP, sendOTP, storeOTP, verifyOTP } from "../utils/twoFAUtil.js";

/* =========================
   📧 STEP 1: LOGIN WITH EMAIL & PASSWORD
========================= */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Check if user exists
    const user = USERS[email];
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // User authenticated, now send OTP for 2FA
    const otp = generateOTP();
    storeOTP(email, otp);
    
    const otpSent = await sendOTP(email, otp);
    
    if (!otpSent) {
      return res.status(500).json({ message: "Failed to send OTP. Please try again." });
    }

    // Store email in session temporarily (for OTP verification)
    req.session.tempEmail = email;
    req.session.tempUser = {
      email,
      balance: user.balance,
    };

    console.log("✅ Login: Email & password verified. OTP sent to", email);

    // Save session before responding
    req.session.save((err) => {
      if (err) {
        console.error("❌ Session save error:", err);
        return res.status(500).json({ message: "Session save failed" });
      }

      res.json({
        message: "Email & password verified. OTP sent to your email.",
        email,
        requiresOTP: true,
      });
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   🔐 STEP 2: VERIFY OTP
========================= */

export const verifyOTPController = (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP required" });
    }

    // Check if session has temp email
    if (!req.session.tempEmail || req.session.tempEmail !== email) {
      return res.status(401).json({ message: "Invalid session. Please login first." });
    }

    // Verify OTP
    const verification = verifyOTP(email, otp);
    if (!verification.success) {
      return res.status(401).json({ message: verification.message });
    }

    // OTP verified! Now create proper session
    const user = USERS[email];
    req.session.user = {
      email,
      balance: user.balance,
    };

    let csrfToken = null;

    // Generate CSRF token only in protected mode
    if (SECURITY_MODE === "protected") {
      csrfToken = generateCSRFToken();
      req.session.csrfToken = csrfToken;
    }

    // Clear temporary session data
    delete req.session.tempEmail;
    delete req.session.tempUser;

    console.log("✅ 2FA Verified:", email);
    console.log("🔐 Mode:", SECURITY_MODE);

    res.json({
      message: "Login successful!",
      user: req.session.user,
      csrfToken,
      mode: SECURITY_MODE,
    });

  } catch (error) {
    console.error("❌ OTP VERIFICATION ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   🔄 RESEND OTP
========================= */

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // Check if user is in tempEmail session (i.e., in login flow)
    if (!req.session.tempEmail || req.session.tempEmail !== email) {
      return res.status(401).json({ message: "Invalid session. Please login first." });
    }

    // Generate new OTP
    const otp = generateOTP();
    storeOTP(email, otp);
    
    const otpSent = await sendOTP(email, otp);
    
    if (!otpSent) {
      return res.status(500).json({ message: "Failed to resend OTP. Please try again." });
    }

    console.log("✅ OTP resent to", email);

    res.json({
      message: "OTP resent successfully",
      email,
    });

  } catch (error) {
    console.error("❌ RESEND OTP ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   🚪 LOGOUT
========================= */

export const logout = (req, res) => {
  try {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  } catch (error) {
    console.error("❌ LOGOUT ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =========================
   👤 GET CURRENT USER
========================= */

export const getMe = (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    res.json({
      user: req.session.user,
      mode: SECURITY_MODE,
    });

  } catch (error) {
    console.error("❌ GETME ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};