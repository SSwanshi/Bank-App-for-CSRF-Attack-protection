import { USERS } from "../utils/userStore.js";

/* =========================
   💰 GET BALANCE
========================= */

export const getBalance = (req, res) => {
  const email = req.session.user.email;

  res.json({
    balance: USERS[email].balance,
  });
};

/* =========================
   💸 TRANSFER
========================= */

export const transfer = (req, res) => {
  console.log("🍪 Cookies received:", req.headers.cookie);

  const { amount, to } = req.body;

  const numAmount = Number(amount);
  const sender = req.session.user.email;

  if (!numAmount || numAmount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (!to || !USERS[to]) {
    return res.status(400).json({ message: "Invalid recipient" });
  }

  if (sender === to) {
    return res.status(400).json({ message: "Cannot transfer to self" });
  }

  if (USERS[sender].balance < numAmount) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  // 💸 Transfer logic
  USERS[sender].balance -= numAmount;
  USERS[to].balance += numAmount;

  // sync session
  req.session.user.balance = USERS[sender].balance;

  console.log(`💸 ${sender} → ${to} : ${numAmount}`);
  console.log("💰 Sender Balance:", USERS[sender].balance);
  console.log("💰 Receiver Balance:", USERS[to].balance);

  res.json({
    message: `Transferred ${numAmount} to ${to}`,
    balance: USERS[sender].balance,
  });
};