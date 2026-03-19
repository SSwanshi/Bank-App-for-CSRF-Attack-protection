export const applyCookieMode = (req) => {
  const mode = req.securityMode || "vulnerable";

  if (mode === "vulnerable") {
    req.session.cookie.sameSite = "none";
    req.session.cookie.secure = false; // true in production (HTTPS required)
  } else {
    req.session.cookie.sameSite = "lax";
    req.session.cookie.secure = false;
  }
};