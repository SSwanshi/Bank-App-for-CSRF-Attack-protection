"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import API from "../utils/api";

export default function TransferForm({ csrfToken }: { csrfToken: string | null }) {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const handleTransfer = async () => {
    try {
      const res = await API.post(
        "/bank/transfer",
        { amount, to },
        {
          headers: csrfToken
            ? { "X-CSRF-Token": csrfToken }
            : {},
        }
      );

      alert(res.data.message);
    } catch (err: unknown) {
      if (isAxiosError<{ message?: string }>(err)) {
        alert(err.response?.data?.message || "Error");
      } else {
        alert("Error");
      }
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <input
        type="text"
        placeholder="Recipient (use email: adityaspgm@gmail.com or sarvjeet.s23@iiits.in)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border p-2"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2"
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