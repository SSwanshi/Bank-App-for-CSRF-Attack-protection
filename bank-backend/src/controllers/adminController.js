import { SECURITY_MODE, setMode } from "../server.js";

export const toggleMode = (req, res) => {
  const newMode =
    SECURITY_MODE === "vulnerable" ? "protected" : "vulnerable";

  setMode(newMode);

  // destroy session to avoid mixed cookie behavior
  req.session.destroy(() => {
    res.json({
      message: `Switched to ${newMode} mode. Please login again.`,
      mode: newMode,
    });
  });
};

export const getMode = (req, res) => {
  res.json({ mode: SECURITY_MODE });
};