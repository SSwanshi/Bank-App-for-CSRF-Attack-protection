import { generateCSRFToken } from "../utils/generateToken.js";
import { SECURITY_MODE } from "../server.js";
import { USERS } from "../utils/userStore.js";

/* =========================
   🔐 LOGIN
========================= */

export const login = (req, res) => {
  try {
    const { username } = req.body;

    // validate user
    const user = USERS[username];

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    // attach user to session
    req.session.user = {
      username,
      balance: user.balance,
    };

    let csrfToken = null;

    // generate CSRF token only in protected mode
    if (SECURITY_MODE === "protected") {
      csrfToken = generateCSRFToken();
      req.session.csrfToken = csrfToken;
    }

    console.log("✅ Login:", username);
    console.log("🔐 Mode:", SECURITY_MODE);

    res.json({
      message: "Login successful",
      csrfToken,
      mode: SECURITY_MODE,
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
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