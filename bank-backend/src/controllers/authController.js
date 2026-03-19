import { generateCSRFToken } from "../utils/generateToken.js";
import { SECURITY_MODE } from "../server.js";

/* =========================
   🧠 IN-MEMORY USER STORE
========================= */
import { USERS } from "../utils/userStore.js";

/* =========================
   🍪 APPLY COOKIE MODE
========================= */

/* =========================
   🔐 LOGIN
========================= */

export const login = (req, res) => {
  const { username } = req.body;

  const user = USERS[username];

  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }

  // attach user to session
  req.session.user = {
    username,
    balance: user.balance,
  };

  // apply cookie behavior
  applyCookieMode(req);

  let csrfToken = null;

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
};

/* =========================
   🚪 LOGOUT
========================= */

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};

/* =========================
   👤 GET CURRENT USER
========================= */

export const getMe = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  res.json({
    user: req.session.user,
    mode: SECURITY_MODE,
  });
};