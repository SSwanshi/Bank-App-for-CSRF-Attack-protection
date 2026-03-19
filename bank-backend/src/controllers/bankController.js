/* =========================
   🧠 SAME USER STORE
   (IMPORTANT: keep consistent)
========================= */

import { USERS } from "../utils/userStore.js";


/* =========================
   💰 GET BALANCE
========================= */

export const getBalance = (req, res) => {
  const username = req.session.user.username;

  res.json({
    balance: USERS[username].balance,
  });
};

/* =========================
   💸 TRANSFER
========================= */

export const transfer = (req, res) => {
  console.log("🍪 Cookies received:", req.headers.cookie);

  const { amount } = req.body;
  const numAmount = Number(amount);

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  const username = req.session.user.username;

  if (USERS[username].balance < numAmount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  // 🔥 update global store
  USERS[username].balance -= numAmount;

  // 🔁 sync session
  req.session.user.balance = USERS[username].balance;

  console.log("💸 Transfer executed:", numAmount);
  console.log("💰 New Balance:", USERS[username].balance);

  res.json({
    message: "Transfer successful",
    balance: USERS[username].balance,
  });
};