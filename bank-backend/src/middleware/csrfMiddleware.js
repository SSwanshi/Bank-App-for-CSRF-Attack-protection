export const verifyCSRF = (req, res, next) => {
  const clientToken = req.headers["x-csrf-token"];
  const serverToken = req.session.csrfToken;

  if (!clientToken) {
    console.log("❌ CSRF Missing");
    return res.status(403).json({ message: "Missing CSRF Token" });
  }

  if (!serverToken) {
    console.log("❌ CSRF Not in session");
    return res.status(403).json({ message: "Invalid CSRF Token" });
  }

  if (clientToken !== serverToken) {
    console.log("❌ CSRF Mismatch");
    return res.status(403).json({ message: "Invalid CSRF Token" });
  }

  console.log("✅ CSRF Verified");

  next();
};