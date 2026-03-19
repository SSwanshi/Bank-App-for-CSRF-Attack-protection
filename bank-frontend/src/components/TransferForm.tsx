"use client";

import { useState } from "react";
import API from "../utils/api";

export default function TransferForm({ csrfToken }: { csrfToken: string | null }) {
  const [amount, setAmount] = useState("");

  const handleTransfer = async () => {
    try {
      const res = await API.post(
        "/bank/transfer",
        { amount },
        {
          headers: csrfToken
            ? { "X-CSRF-Token": csrfToken }
            : {},
        }
      );

      alert("Transfer Success: " + res.data.balance);
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

      alert(message || "Error");
    }
  };

  return (
    <div className="mt-4">
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={handleTransfer}
        className="bg-green-500 text-white px-3 py-1"
      >
        Transfer
      </button>
    </div>
  );
}